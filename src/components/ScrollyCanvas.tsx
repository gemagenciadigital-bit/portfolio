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
    <div ref={containerRef} className="relative h-[600vh] w-full bg-[#0a0a0a]">
      {/* BACKGROUND LAYER: Fixed across the entire screen */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="sticky top-0 left-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* PARALLAX LAYER 1: The Human (Canvas) */}
        <motion.div 
          style={{ y: yHuman, opacity: opacityHuman }}
          className="relative w-[85vw] h-[75vh] max-w-5xl z-20 flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full drop-shadow-[0_0_60px_rgba(0,180,255,0.15)]"
          />
        </motion.div>

        {/* PARALLAX LAYER 2: Floating Digital Assets (Fast) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <motion.div style={{ y: yDataFast }} className="absolute top-[15%] left-[12%] text-blue-400/25 text-8xl font-black italic select-none">ROI</motion.div>
          <motion.div style={{ y: yDataSlow }} className="absolute top-[65%] right-[10%] text-purple-400/25 text-7xl font-black select-none">DATA</motion.div>
          <motion.div style={{ y: yDataFast }} className="absolute bottom-[15%] left-[18%] text-emerald-400/20 text-9xl font-black select-none">AI</motion.div>
          <motion.div style={{ y: yDataSlow }} className="absolute top-[45%] left-[8%] text-white/5 text-6xl font-black select-none">ADS</motion.div>
          <motion.div style={{ y: yDataFast }} className="absolute top-[10%] right-[8%] text-cyan-400/20 text-8xl font-black tracking-tighter select-none">SEO</motion.div>
        </div>

        {/* PARALLAX LAYER 3: Dynamic Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        {/* Text Content Overlay */}
        {imagesLoaded && <Overlay scrollYProgress={rawScroll} />}

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
             <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin" />
              <p className="text-white/10 tracking-[0.4em] text-[10px] uppercase font-bold">Initializing Hologram</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
