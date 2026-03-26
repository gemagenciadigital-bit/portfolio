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

    // 1. NEON BACKGROUND: Ambient Deep Glow (Teal & Orange)
    // We draw the base color atmosphere using radial gradients
    const bgGradient = ctx.createRadialGradient(
      nativeWidth * 0.2, nativeHeight * 0.2, 0,
      nativeWidth * 0.2, nativeHeight * 0.2, nativeWidth * 0.8
    );
    bgGradient.addColorStop(0, "rgba(0, 150, 255, 0.1)"); // Teal glow top-left
    bgGradient.addColorStop(1, "rgba(10, 10, 15, 1)"); 
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, nativeWidth, nativeHeight);

    const orangeGlow = ctx.createRadialGradient(
      nativeWidth * 0.8, nativeHeight * 0.8, 0,
      nativeWidth * 0.8, nativeHeight * 0.8, nativeWidth * 0.6
    );
    orangeGlow.addColorStop(0, "rgba(255, 100, 0, 0.05)"); // Orange glow bottom-right
    orangeGlow.addColorStop(1, "rgba(10, 10, 15, 0)");
    ctx.fillStyle = orangeGlow;
    ctx.fillRect(0, 0, nativeWidth, nativeHeight);

    // 2. AMBILIGHT: Blurred Video Influence
    ctx.globalAlpha = 0.3;
    ctx.filter = "blur(80px) saturate(2)";
    const canvasRatio = nativeWidth / nativeHeight;
    const imgRatio = img.width / img.height;
    let bgWidth = nativeWidth * 0.8;
    let bgHeight = nativeHeight * 0.8;
    if (imgRatio > canvasRatio) {
      bgWidth = nativeHeight * 0.8 * imgRatio;
    } else {
      bgHeight = nativeWidth * 0.8 / imgRatio;
    }
    ctx.drawImage(img, (nativeWidth - bgWidth) / 2, (nativeHeight - bgHeight) / 2, bgWidth, bgHeight);
    ctx.filter = "none";
    ctx.globalAlpha = 1.0;

    // 3. NEON MARKETING NEURAL NETWORK (Nodes & Connections)
    const time = Date.now() * 0.0005;
    const nodes = [];
    const nodeCount = 30;
    // Generate static-ish nodes with slight movement based on time
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.sin(i * 456.7 + time * 0.2) * 0.5 + 0.5) * nativeWidth;
      const y = (Math.cos(i * 234.1 + time * 0.15) * 0.5 + 0.5) * nativeHeight;
      nodes.push({ x, y });
    }

    ctx.strokeStyle = "rgba(0, 200, 255, 0.15)";
    ctx.lineWidth = 0.5 * dpr;
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 * dpr) {
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
        }
      }
    }
    ctx.stroke();

    // 4. FLOATING MARKETING KEYWORDS
    const keywords = ["ROI", "DATA", "AI", "SEO", "ADS", "WEB"];
    ctx.font = `bold ${12 * dpr}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.textAlign = "center";
    keywords.forEach((word, i) => {
      const x = (Math.sin(i * 123 + time * 0.1) * 0.4 + 0.5) * nativeWidth;
      const y = (Math.cos(i * 321 + time * 0.08) * 0.4 + 0.5) * nativeHeight;
      ctx.fillText(word, x, y);
    });

    // 5. MAIN WORKSTATION VIEWPORT (The Video)
    const maxViewportWidth = nativeWidth * 0.85;
    const maxViewportHeight = nativeHeight * 0.75;
    let finalWidth = img.width * (nativeHeight / 1080) * dpr;
    let finalHeight = img.height * (nativeHeight / 1080) * dpr;

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

    // Viewport Border (Neon frame)
    ctx.strokeStyle = "rgba(0, 210, 255, 0.3)";
    ctx.lineWidth = 2 * dpr;
    ctx.strokeRect(drawX - 2, drawY - 2, finalWidth + 4, finalHeight + 4);
    
    ctx.shadowBlur = 30 * dpr;
    ctx.shadowColor = "rgba(0, 180, 255, 0.3)";
    ctx.filter = "contrast(1.15) brightness(1.05) saturate(1.15)";
    ctx.drawImage(img, drawX, drawY, finalWidth, finalHeight);
    ctx.filter = "none";
    ctx.shadowBlur = 0;

    // 6. SCAN LINE (Faster Neon Pulse)
    const scanPos = (Date.now() % 3000 / 3000) * nativeHeight;
    ctx.fillStyle = "rgba(0, 180, 255, 0.05)";
    ctx.fillRect(0, scanPos, nativeWidth, 1 * dpr);
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
