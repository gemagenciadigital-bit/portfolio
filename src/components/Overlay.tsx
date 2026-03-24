"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Section 1 (0% scroll)
  const o1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [-15, -45, -70]);
  const scale1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1.05, 1.1]);

  // Section 2 (30% scroll)
  const o2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [30, 0, -30, -60]);

  // Section 3 (60% scroll)
  const o3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [30, 0, -30, -60]);
  
  // Progress bar indicator
  const wProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col px-4 md:px-20 mx-auto max-w-7xl">
        
        {/* Section 1: 0% scroll (Appears top-left where the eyes are looking initially) */}
        <motion.div 
          className="absolute top-[20%] md:top-[25%] left-[10%] md:left-[20%] text-left"
          style={{ opacity: o1, y: y1, scale: scale1 }}
        >
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
            Eze
          </h1>
          <p className="mt-4 text-xl md:text-3xl text-gray-200 font-medium tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
            Desarrollador Creativo.
          </p>
        </motion.div>

        {/* Section 2: 30% scroll (Appears centered-right) */}
        <motion.div 
          className="absolute top-[45%] right-[10%] md:right-[15%] max-w-md text-right flex flex-col items-end"
          style={{ opacity: o2, y: y2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
            Construyo <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white drop-shadow-none">experiencias</span> digitales.
          </h2>
          <div className="h-1 w-20 bg-white/20 mt-6 rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
             <div className="h-full bg-white w-2/3" />
          </div>
        </motion.div>

        {/* Section 3: 60% scroll (Appears center-left/bottom) */}
        <motion.div 
          className="absolute bottom-[20%] left-[10%] md:left-[15%] max-w-md text-left flex flex-col items-start"
          style={{ opacity: o3, y: y3 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
            Uniendo diseño e <span className="italic font-light">ingeniería.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-200 font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
            Desarrollo visual de alto rendimiento y movimiento fluido.
          </p>
        </motion.div>
        
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none opacity-50">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/50">Scroll</span>
        <div className="h-16 w-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
             className="absolute top-0 left-0 w-full bg-white/80"
             style={{ height: wProgress }}
          />
        </div>
      </div>
    </>
  );
}
