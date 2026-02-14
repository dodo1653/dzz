import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Layout({ children }) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border border-cyan-400/50 rounded-full scale-100 animate-pulse" />
          <div className="absolute inset-[35%] bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
          <div className="absolute -inset-2 border-t border-l border-cyan-400/20 rounded-full rotate-45" />
        </div>
      </motion.div>
      <div className="relative z-1">{children}</div>
    </div>
  );
}
