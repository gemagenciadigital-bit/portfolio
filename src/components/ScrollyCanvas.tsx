"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, MotionValue } from "framer-motion";
import Overlay from "./Overlay";

/**
 * Ensures a number is padded with zeroes up to 2 digits.
 * Converts 0 -> "00", 1 -> "01", ..., 79 -> "79"
 */
const getFrameSrc = (index: number) => {
  const paddedIndex = index.toString().padStart(2, "0");
  return `/sequence/frame_${paddedIndex}_delay-0.066s.png`;
};

const FRAME_COUNT = 80;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const renderCanvas = () => {
    if (!canvasRef.current || !imagesRef.current.length) return;
    const canvas = canvasRef.current;
    // Utilize alpha: false for slight compositor performance boost
    const ctx = canvas.getContext("2d", { alpha: false }); 
    if (!ctx) return;

    const img = imagesRef.current[currentFrameRef.current];
    if (!img || !img.width) return;

    // 1. Setup High DPI Canvas sizing logic
    const dpr = window.devicePixelRatio || 1;
    const targetWidth = window.innerWidth;
    const targetHeight = window.innerHeight;
    
    // Multiply by dpr for internal render buffer
    const nativeWidth = targetWidth * dpr;
    const nativeHeight = targetHeight * dpr;
    
    if (canvas.width !== nativeWidth || canvas.height !== nativeHeight) {
      canvas.width = nativeWidth;
      canvas.height = nativeHeight;
    }

    // 2. Mathematical Object-Fit: Cover
    const canvasRatio = nativeWidth / nativeHeight;
    const imgRatio = img.width / img.height;
    
    let drawWidth = nativeWidth;
    let drawHeight = nativeHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Image is proportionally wider than the canvas
      drawWidth = nativeHeight * imgRatio;
      offsetX = (nativeWidth - drawWidth) / 2;
    } else {
      // Image is proportionally taller
      drawHeight = nativeWidth / imgRatio;
      offsetY = (nativeHeight - drawHeight) / 2;
    }

    // 3. High Quality Context settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, nativeWidth, nativeHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    // Preload images to prevent flickering
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        await new Promise((resolve) => {
          img.onload = () => {
            loadedCount++;
            resolve(true);
          };
          // Best effort loading
          img.onerror = () => {
            resolve(false);
          };
        });
        loadedImages.push(img);
      }
      
      imagesRef.current = loadedImages;
      setImagesLoaded(true);

      // Initial draw
      requestAnimationFrame(renderCanvas);
    };

    preloadImages();

    // Listen for resize to recalculate canvas sizing and redraw
    window.addEventListener("resize", renderCanvas);
    return () => window.removeEventListener("resize", renderCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    
    // Convert scroll 0-1 to frame 0-79
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(renderCanvas);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-[#121212]">
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        {/* Canvas rendering the scrollytelling background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Overlay text elements */}
        {imagesLoaded && <Overlay scrollYProgress={scrollYProgress} />}

        {/* Loading State */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#121212] z-50">
            <p className="text-white/50 animate-pulse tracking-widest text-sm uppercase">Loading Experience</p>
          </div>
        )}
      </div>
    </div>
  );
}
