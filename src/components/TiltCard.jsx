import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = '', intensity = 10 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate center position
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    // Divide by card dimensions and multiply by intensity
    const rotateXValue = -(mouseY / (rect.height / 2)) * intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovering ? 1.01 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 30,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        position: 'relative',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        transform: 'translateZ(0)'
      }}
    >
      {/* Shine effect that follows cursor */}
      <motion.div
        animate={{
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${((rotateY / intensity) * 50) + 50}% ${((rotateX / intensity) * 50) + 50}%, rgba(255,255,255,0.1), transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      
      {/* Card content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;
