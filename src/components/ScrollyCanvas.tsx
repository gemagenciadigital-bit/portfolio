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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Code Terminal Data
  const codeLines = [
    { text: "> initializing marketing-os v1.0.4...", color: "text-blue-400" },
    { text: "> loading neural_marketing_engine...", color: "text-white/50" },
    { text: "> connecting to google-ads-api...", color: "text-blue-200" },
    { text: "> connected successfully.", color: "text-emerald-400" },
    { text: "const roi = scale_impact(data_stream);", color: "text-purple-400" },
    { text: "if (conversion < benchmark) { optimize(); }", color: "text-yellow-200" },
    { text: "ai.analyze_customer_journey(path);", color: "text-cyan-400" },
    { text: "> deploying AI-driven funnel...", color: "text-white" },
    { text: "> funnel active: ROI +240%", color: "text-emerald-500" },
    { text: "portfolio.show_projects();", color: "text-blue-400/80" },
  ];

  const visibleCodeCount = useTransform(scrollYProgress, [0, 0.8], [0, codeLines.length]);
  const currentLineIndex = Math.floor(visibleCodeCount.get());

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

    ctx.clearRect(0, 0, nativeWidth, nativeHeight);
    
    // Fit image to canvas (Contain)
    const imgRatio = img.width / img.height;
    const canvasRatio = nativeWidth / nativeHeight;
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

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.filter = "contrast(1.1) brightness(1.1) saturate(1.1)";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
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
          img.onload = () => { if (active) imagesRef.current[i] = img; resolve(); };
          img.onerror = () => resolve();
        });
        loadPromises.push(p);
      }
      Promise.all(loadPromises);
    };
    preloadImages();
    window.addEventListener("resize", renderCanvas);
    return () => { active = false; window.removeEventListener("resize", renderCanvas); };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(renderCanvas);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[600vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8">
        
        {/* LEFT: Code Terminal (Double Narrative) */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 w-full h-[40vh] md:h-[60vh] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-mono overflow-hidden shadow-2xl relative"
        >
          {/* Terminal Window Decoration */}
          <div className="flex gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[10px] text-white/20 tracking-widest uppercase">system_executor.sh</span>
          </div>

          <div className="space-y-3">
             {codeLines.map((line, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 5 }}
                 animate={i <= currentLineIndex ? { opacity: 1, y: 0 } : { opacity: 0 }}
                 className={`text-xs md:text-sm ${line.color} leading-relaxed flex items-start gap-2`}
               >
                 <span className="text-white/10 select-none">{i + 1}</span>
                 <span>{line.text}</span>
               </motion.div>
             ))}
             {/* Blinking Cursor */}
             <motion.div 
               animate={{ opacity: [1, 0] }}
               transition={{ duration: 0.8, repeat: Infinity }}
               className="w-2 h-4 bg-emerald-400/50 ml-6"
             />
          </div>

          {/* Background Data Stream (Visual only) */}
          <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none text-[80px] font-black italic select-none -rotate-12 translate-x-12 translate-y-12">
            CODING
          </div>
        </motion.div>

        {/* RIGHT: Human Mastermind (The Persona) */}
        <motion.div 
           initial={{ x: 100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="flex-1 w-full h-[40vh] md:h-[60vh] relative group"
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-colors duration-1000" />
          
          <div className="relative w-full h-full bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full" />
            
            {/* Interaction Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-t-white/5 mix-blend-overlay" />
          </div>

          {/* Tech Detail (Floating Tag) */}
          <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/50 tracking-widest font-bold uppercase">Persona Integrated</span>
          </div>
        </motion.div>

        {/* Overlay text elements */}
        {imagesLoaded && <Overlay scrollYProgress={scrollYProgress} />}

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/5 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-white/20 tracking-widest text-[10px] uppercase font-bold">Booting Marketing-OS</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
