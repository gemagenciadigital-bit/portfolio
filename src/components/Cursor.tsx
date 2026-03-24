"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trail for the outer ring
  const springX = useSpring(mouseX, { stiffness: 300, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28, mass: 0.5 });

  // Fast response for the inner dot
  const fastSpringX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.1 });
  const fastSpringY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible, mouseX, mouseY]);

  // If on a touch device, or mouse hasn't moved yet, don't show the custom cursor
  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body { cursor: none; }
        }
      `}} />
      
      {/* Outer subtle glowing ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-[9999] backdrop-blur-[2px] hidden md:block flex justify-center items-center"
        style={{ 
          x: springX, 
          y: springY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
      
      {/* Inner sharp core dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_15px_2px_rgba(255,255,255,0.8)]"
        style={{ 
          x: fastSpringX, 
          y: fastSpringY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
    </>
  );
}
