"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";

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

  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  // Integrated Narrative & Code Events (Human-Centric & Strategic)
  const terminalEvents = [
    { type: "code", text: "> inicializando arquitectura digital...", color: "text-blue-400" },
    { type: "narrative", text: "EZE", subtext: "Desarrollador Creativo.", color: "text-white" },
    { type: "code", text: "> activando motor de crecimiento v3.0...", color: "text-white/30" },
    { type: "code", text: "> sincronizando campañas en Meta Ads...", color: "text-blue-300" },
    { type: "narrative", text: "Construyo experiencias", subtext: "Digitales y de alto impacto.", color: "text-white" },
    { type: "code", text: "> sistema conectado. escalando resultados...", color: "text-emerald-400" },
    { type: "code", text: "mejorar_ventas(clientes_reales);", color: "text-purple-400" },
    { type: "code", text: "si (ventas < objetivo) { optimizar_todo(); }", color: "text-yellow-200" },
    { type: "narrative", text: "Uniendo diseño e ingeniería.", subtext: "Visuales de alto rendimiento.", color: "text-white" },
    { type: "code", text: "comprendiendo_el_camino_de_tu_cliente();", color: "text-cyan-400" },
    { type: "code", text: "> lanzando sistema de captación inteligente...", color: "text-white" },
    { type: "code", text: "> sistema activo. aumentando visibilidad...", color: "text-emerald-500" },
    { type: "code", text: "ver_proyectos_exitosos();", color: "text-blue-400" },
  ];

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
    
    // 1. Update Video Frame
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(renderCanvas);
    }

    // 2. Update Terminal Text Reveal State
    const nextIdx = Math.floor(latest * (terminalEvents.length + 1));
    if (nextIdx !== currentEventIdx) {
      setCurrentEventIdx(nextIdx);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-6 md:gap-12">
        
        {/* LEFT: Unified Terminal (Text-heavy center) */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 w-full h-[50vh] md:h-[70vh] bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 font-mono overflow-hidden shadow-2xl relative"
        >
          {/* Terminal Window Decoration */}
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            </div>
            <span className="ml-2 text-[10px] text-white/20 tracking-[0.4em] uppercase font-bold">digital_architect.sh v2.0.0</span>
          </div>

          {/* Scrolling Event List */}
          <div className="space-y-6 flex flex-col items-center text-center h-full">
             {terminalEvents.map((event, i) => {
               const isNarrative = event.type === "narrative";
               const isVisible = i <= currentEventIdx;
               
               return (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0 }}
                   transition={{ duration: 0.5 }}
                   className={`w-full ${isNarrative ? "py-4" : "opacity-60"}`}
                 >
                   {isNarrative ? (
                     <div className="flex flex-col items-center gap-2">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                          {event.text}
                        </h2>
                        {event.subtext && (
                          <p className="text-blue-400 text-xs md:text-sm font-medium tracking-widest uppercase">
                            {event.subtext}
                          </p>
                        )}
                     </div>
                   ) : (
                     <div className="flex justify-center gap-3 text-[10px] md:text-xs text-white/50">
                        <span className="text-cyan-400 font-bold select-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                          [{i.toString().padStart(2, '0')}]
                        </span>
                        <span className={event.color}>{event.text}</span>
                     </div>
                   )}
                 </motion.div>
               );
             })}
             
             {/* Dynamic Cursor at active point */}
             <motion.div 
               animate={{ opacity: [1, 0] }}
               transition={{ duration: 0.6, repeat: Infinity }}
               className="w-3 h-1 bg-blue-500/80 mt-2"
             />
          </div>

          {/* Background Decorative Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </motion.div>

        {/* RIGHT: Visual Interaction */}
        <motion.div 
           initial={{ x: 100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="flex-1 w-full h-[40vh] md:h-[70vh] relative group z-10"
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full" />
          
          <div className="relative w-full h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
             <div className="relative w-2 h-2">
               <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
               <div className="absolute inset-0 bg-blue-400 rounded-full" />
             </div>
             <span className="text-[9px] text-white/60 tracking-[0.3em] font-bold uppercase">Streaming live protocol</span>
          </div>
        </motion.div>

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-2 border-white/5 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white/10 tracking-[0.5em] text-[10px] uppercase font-bold animate-pulse">Syncing Persona</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
