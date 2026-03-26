"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
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

    // 4. Subtle Cinematic Overlay (Vignette)
    // This makes the center elements (the face and UI) pop more
    const gradient = ctx.createRadialGradient(
      nativeWidth / 2, nativeHeight / 2, 0,
      nativeWidth / 2, nativeHeight / 2, Math.max(nativeWidth, nativeHeight) * 0.8
    );
    gradient.addColorStop(0, "rgba(18, 18, 18, 0)");
    gradient.addColorStop(1, "rgba(18, 18, 18, 0.7)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, nativeWidth, nativeHeight);
  };

  useEffect(() => {
    let active = true;

    // Aggressive Progressive Preload Strategy
    const preloadImages = async () => {
      // 1. Load First Frame IMMEDIATELY to unblock UI
      const firstImg = new Image();
      firstImg.src = getFrameSrc(0);
      await new Promise((resolve) => {
        firstImg.onload = () => resolve(true);
        firstImg.onerror = () => resolve(false);
      });
      
      if (!active) return;
      imagesRef.current[0] = firstImg;
      setImagesLoaded(true); // Unblock viewing instantly
      requestAnimationFrame(renderCanvas);

      // 2. Parallel Background Fetching for the rest
      const loadPromises = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        const img = new Image();
        // Browser queues these massively in parallel
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
      
      // Wait for all to cache silently
      Promise.all(loadPromises);
    };

    preloadImages();

    // Listen for resize to recalculate canvas sizing and redraw
    window.addEventListener("resize", renderCanvas);
    return () => {
      active = false;
      window.removeEventListener("resize", renderCanvas);
    };
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
