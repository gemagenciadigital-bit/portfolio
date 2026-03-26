"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, useSpring, useTransform } from "framer-motion";

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

  // Inertia for smoother video frames and terminal transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  // Integrated Narrative & Code Events (Human-Centric & Strategic)
  const terminalEvents = [
    { type: "code", text: "> inicializando arquitectura digital...", color: "text-blue-400" },
    { type: "narrative", text: "EZE", subtext: "Desarrollador Creativo.", color: "text-white" },
    { type: "code", text: "> activando motor de crecimiento v3.0...", color: "text-white/30" },
    { type: "code", text: "> sincronizando campañas en Meta Ads...", color: "text-blue-300" },
    { type: "narrative", text: "Construyendo Experiencias", subtext: "Digitales de alto impacto", color: "text-white" },
    { type: "code", text: "> sistema conectado. escalando resultados...", color: "text-emerald-400" },
    { type: "code", text: "mejorar_ventas(clientes_reales);", color: "text-purple-400" },
    { type: "code", text: "si (ventas < objetivo) { optimizar_todo(); }", color: "text-yellow-200" },
    { type: "narrative", text: "Diseñando Estrategias", subtext: "Visuales de alto rendimiento.", color: "text-white" },
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

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    
    // 1. Update Video Frame
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(renderCanvas);
    }

    // 2. Update Terminal Text Reveal State (with Curved Progression)
    // Using a power curve to make it more responsive at the start
    const curvedLatest = Math.pow(latest, 0.65);
    const nextIdx = Math.floor(curvedLatest * (terminalEvents.length + 1));
    if (nextIdx !== currentEventIdx) {
      setCurrentEventIdx(nextIdx);
    }
  });

  // Dynamic Event Filtering: Separate the fixed from the active
  const fixedHeader = terminalEvents[1]; // EZE
  const activeEvents = terminalEvents.slice(2); 
  const activeIdx = Math.floor(Math.max(0, currentEventIdx - 2));

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-6 md:gap-12">
        
        {/* LEFT: Unified Terminal (Text-heavy center) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 w-full max-w-full h-[55vh] md:h-[70vh] bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 font-mono overflow-hidden shadow-2xl relative flex flex-col"
        >
          {/* Terminal Window Decoration */}
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            </div>
            <span className="ml-2 text-[10px] text-white/20 tracking-[0.4em] uppercase font-bold">interface.sys</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start text-center">
             {/* FIXED HEADER: Always Visible */}
             <div className="mb-6 w-full animate-in fade-in slide-in-from-top duration-1000">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                  {fixedHeader.text}
                </h2>
                <p className="text-cyan-400 text-sm md:text-base font-medium italic tracking-widest uppercase mt-2">
                  {fixedHeader.subtext}
                </p>

                {/* Integrated Scroll Indicator */}
                <motion.div
                   style={{ 
                     opacity: useTransform(smoothProgress, [0, 0.03], [1, 0]),
                     pointerEvents: 'none'
                   }}
                   className="mt-6 flex flex-col items-center gap-2"
                >
                   <span className="text-[10px] md:text-xs font-mono text-cyan-400/60 tracking-widest uppercase animate-pulse">
                     {">>> scroll_suave_para_conectar."}
                   </span>
                   <motion.div
                     animate={{ y: [0, 8, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     className="w-px h-12 bg-gradient-to-b from-cyan-400/30 to-transparent"
                   />
                </motion.div>
             </div>

             {/* DYNAMIC SLOT: Replaces content on scroll (Aligned Top) */}
             <div className="w-full relative min-h-[160px] md:min-h-[240px] flex items-start justify-center pt-2">
                {activeEvents.map((event, i) => {
                  const isVisible = i === activeIdx;
                  const isNarrative = event.type === "narrative";
                  
                  if (!isVisible) return null;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full"
                    >
                      {isNarrative ? (
                        <div className="flex flex-col items-center gap-3">
                           <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] drop-shadow-2xl px-2">
                             {event.text}
                           </h3>
                           {event.subtext && (
                             <p className="text-cyan-400 text-xs md:text-sm font-medium italic tracking-[0.2em] uppercase">
                               {event.subtext}
                             </p>
                           )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex justify-center gap-3 text-[10px] md:text-sm text-white/50 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 mx-auto">
                             <span className="text-cyan-400 font-bold tracking-widest">[{i.toString().padStart(2, '0')}]</span>
                             <span className={event.color}>{event.text}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
             </div>
             
             {/* Active Command Cursor */}
             <motion.div 
               animate={{ opacity: [1, 0] }}
               transition={{ duration: 0.6, repeat: Infinity }}
               className="w-8 h-0.5 bg-blue-500/40 mt-auto mb-4"
             />
          </div>

          {/* Background Decorative Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </motion.div>

        {/* RIGHT: Visual Interaction */}
        <motion.div 
           initial={{ x: 100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="flex-1 w-full max-w-full h-[40vh] md:h-[70vh] relative group z-10"
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
