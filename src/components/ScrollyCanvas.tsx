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
    const ctx = canvas.getContext("2d", { alpha: false }); 
    if (!ctx) return;

    const img = imagesRef.current[currentFrameRef.current];
    if (!img || !img.width) return;

    const dpr = window.devicePixelRatio || 1;
    const targetWidth = window.innerWidth;
    const targetHeight = window.innerHeight;
    
    const nativeWidth = targetWidth * dpr;
    const nativeHeight = targetHeight * dpr;
    
    if (canvas.width !== nativeWidth || canvas.height !== nativeHeight) {
      canvas.width = nativeWidth;
      canvas.height = nativeHeight;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // --- RENDER LAYERS ---

    // 1. BACKGROUND: Ambient Fill (Ambilight)
    // We draw the same image STRETCHED and BLURRED to fill the screen
    ctx.filter = "blur(60px) brightness(0.4) saturate(1.5)";
    const canvasRatio = nativeWidth / nativeHeight;
    const imgRatio = img.width / img.height;
    
    let bgWidth = nativeWidth;
    let bgHeight = nativeHeight;
    let bgX = 0;
    let bgY = 0;

    if (imgRatio > canvasRatio) {
      bgWidth = nativeHeight * imgRatio;
      bgX = (nativeWidth - bgWidth) / 2;
    } else {
      bgHeight = nativeWidth / imgRatio;
      bgY = (nativeHeight - bgHeight) / 2;
    }
    
    ctx.drawImage(img, bgX, bgY, bgWidth, bgHeight);
    ctx.filter = "none"; // Reset filter

    // 2. GENERATIVE GRID
    const gridSize = 50 * dpr;
    const scrollOffset = (scrollYProgress.get() * 200) * dpr;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1 * dpr;
    
    // Vertical lines
    for (let x = (nativeWidth / 2) % gridSize; x < nativeWidth; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, nativeHeight);
    }
    // Horizontal lines (moving with scroll)
    for (let y = (nativeHeight / 2 + scrollOffset) % gridSize; y < nativeHeight; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(nativeWidth, y);
    }
    ctx.stroke();

    // 3. MAIN WORKSTATION VIEWPORT (The Video)
    // We maintain a sharp resolution by not over-stretching
    // Scale it to 80% of screen height or native width, whichever is smaller
    const maxViewportWidth = nativeWidth * 0.85;
    const maxViewportHeight = nativeHeight * 0.75;
    
    let finalWidth = img.width * (nativeHeight / 1080) * dpr; // Scale relative to 1080p height
    let finalHeight = img.height * (nativeHeight / 1080) * dpr;

    // Constrain to viewport limits
    if (finalWidth > maxViewportWidth) {
      const scale = maxViewportWidth / finalWidth;
      finalWidth *= scale;
      finalHeight *= scale;
    }
    if (finalHeight > maxViewportHeight) {
      const scale = maxViewportHeight / finalHeight;
      finalWidth *= scale;
      finalHeight *= scale;
    }

    const drawX = (nativeWidth - finalWidth) / 2;
    const drawY = (nativeHeight - finalHeight) / 2;

    // Draw viewport glow/border
    ctx.shadowBlur = 40 * dpr;
    ctx.shadowColor = "rgba(0, 150, 255, 0.2)";
    
    // Slight contrast/sharpness filter for the main image
    ctx.filter = "contrast(1.1) brightness(1.05) saturate(1.1)";
    ctx.drawImage(img, drawX, drawY, finalWidth, finalHeight);
    ctx.filter = "none";
    ctx.shadowBlur = 0;

    // 4. SCAN LINE
    const scanPos = (Date.now() % 4000 / 4000) * nativeHeight;
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(0, scanPos, nativeWidth, 2 * dpr);
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
    // Animation loop for scanning line and dynamic elements
    let animId: number;
    const animate = () => {
      renderCanvas();
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      active = false;
      window.removeEventListener("resize", renderCanvas);
      cancelAnimationFrame(animId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      // renderCanvas is now called through the animate loop
    }
  });

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        {/* Canvas rendering the HUD experience */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "auto" }}
        />
        
        {/* Overlay text elements */}
        {imagesLoaded && <Overlay scrollYProgress={scrollYProgress} />}

        {/* Loading State */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              <p className="text-white/30 tracking-[0.3em] text-[10px] uppercase font-bold">Initializing System</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
