import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  const smoothCursorX = useMotionValue(0);
  const smoothCursorY = useMotionValue(0);
  
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;
    let animationFrame;
    let currentX = 0;
    let currentY = 0;
    
    const animate = () => {
      currentX = lerp(currentX, mouseX.get(), 0.15);
      currentY = lerp(currentY, mouseY.get(), 0.15);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationFrame);
  }, [mouseX, mouseY]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX - 16);
    mouseY.set(e.clientY - 16);
    setIsVisible(true);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    const isInteractive = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.getAttribute('role') === 'button' ||
      target.classList.contains('cursor-pointer');
    
    setIsHovering(!!isInteractive);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseOver]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          borderRadius: '50%',
          border: '1px solid rgba(100, 130, 170, 0.5)',
          background: 'rgba(100, 130, 170, 0.05)',
          pointerEvents: 'none',
          zIndex: 99999,
          x: cursorX,
          y: cursorY,
          mixBlendMode: 'difference',
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          left: mouseX.get() + 16,
          top: mouseY.get() + 16,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
      />
      <style>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
