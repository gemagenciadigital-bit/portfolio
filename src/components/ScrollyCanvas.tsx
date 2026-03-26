"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
import Overlay from "./Overlay";

/**
 * Ensures a number is padded with zeroes up to 2 digits.
 * Converts 0 -> "00", 1 -> "01", ..., 79 -> "79"
 */
const getFrameSrc = (index: number) => {
  const paddedIndex = index.toString().padStart(2, "0");
  return `/portfolio/sequence/gifHero/frame_${paddedIndex}_delay-0.062s.webp`;
};

const FRAME_COUNT = 81;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const { scrollYProgress: rawScroll } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax Values for different layers
  const yHuman = useTransform(rawScroll, [0, 1], [0, -100]); // Slower movement
  const yDataFast = useTransform(rawScroll, [0, 1], [0, -400]); // Faster movement
  const yDataSlow = useTransform(rawScroll, [0, 1], [0, -200]); // Mid movement
  const opacityHuman = useTransform(rawScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const renderCanvas = () => {
    if (!canvasRef.current || !imagesRef.current.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d"); 
    if (!ctx) return;

    const img = imagesRef.current[currentFrameRef.current];
    if (!img || !img.width) return;

    const dpr = window.devicePixelRatio || 1;
    const targetWidth = canvas.clientWidth;
    const targetHeight = canvas.clientHeight;
    
    const nativeWidth = targetWidth * dpr;
    const nativeHeight = targetHeight * dpr;
    
    if (canvas.width !== nativeWidth || canvas.height !== nativeHeight) {
      canvas.width = nativeWidth;
      canvas.height = nativeHeight;
    }

    // Centered Object-Fit: Contain logic within the canvas
    const canvasRatio = nativeWidth / nativeHeight;
    const imgRatio = img.width / img.height;
    
    let drawWidth = nativeWidth;
    let drawHeight = nativeHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = nativeWidth;
      drawHeight = nativeWidth / imgRatio;
      offsetY = (nativeHeight - drawHeight) / 2;
    } else {
      drawHeight = nativeHeight;
      drawWidth = nativeHeight * imgRatio;
      offsetX = (nativeWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, nativeWidth, nativeHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // Slight Holographic Glow/Filter
    ctx.filter = "contrast(1.1) brightness(1.2) saturate(1.1)";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.filter = "none";
  };

  useEffect(() => {
    let active = true;

    const preloadImages = async () => {
      const firstImg = new Image();
      firstImg.src = getFrameSrc(0);
      await new Promise((resolve) => {
        firstImg.onload = () => resolve(true);
        firstImg.onerror = () => resolve(false);
      });
      
      if (!active) return;
      imagesRef.current[0] = firstImg;
      setImagesLoaded(true);
      requestAnimationFrame(renderCanvas);

      const loadPromises = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        const p = new Promise<void>((resolve) => {
          img.onload = () => {
            if (active) imagesRef.current[i] = img;
            resolve();
          };
          img.onerror = () => resolve();
        });
        loadPromises.push(p);
      }
      Promise.all(loadPromises);
    };

    preloadImages();

    window.addEventListener("resize", renderCanvas);
    return () => {
      active = false;
      window.removeEventListener("resize", renderCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(rawScroll, "change", (latest) => {
    if (!imagesLoaded) return;
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(renderCanvas);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[600vh] w-full bg-[#0a0a0a] overflow-hidden">
      {/* Background Visual Layer: Fixed Particle/Dot Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {/* PARALLAX LAYER 1: The Human (Canvas) */}
        <motion.div 
          style={{ y: yHuman, opacity: opacityHuman }}
          className="relative w-[80vw] h-[70vh] max-w-4xl z-10"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full drop-shadow-[0_0_50px_rgba(0,180,255,0.2)]"
          />
        </motion.div>

        {/* PARALLAX LAYER 2: Floating Digital Assets (Fast) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div style={{ y: yDataFast }} className="absolute top-[20%] left-[10%] text-blue-400/30 text-8xl font-black italic">ROI</motion.div>
          <motion.div style={{ y: yDataSlow }} className="absolute top-[60%] right-[15%] text-purple-400/30 text-7xl font-black transition-colors">DATA</motion.div>
          <motion.div style={{ y: yDataFast }} className="absolute bottom-[10%] left-[20%] text-emerald-400/20 text-9xl font-black">AI</motion.div>
          <motion.div style={{ y: yDataSlow }} className="absolute top-[40%] left-[5%] text-white/10 text-6xl font-black">ADS</motion.div>
          <motion.div style={{ y: yDataFast }} className="absolute top-[15%] right-[5%] text-cyan-400/20 text-8xl font-black tracking-tighter">SEO</motion.div>
        </div>

        {/* PARALLAX LAYER 3: Dynamic Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        {/* Overlay Content */}
        {imagesLoaded && <Overlay scrollYProgress={rawScroll} />}

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
            <p className="text-white/20 tracking-widest text-[10px] uppercase font-bold animate-pulse">Synchronizing Marketing Interface</p>
          </div>
        )}
      </div>
    </div>
  );
}
