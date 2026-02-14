import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PremiumBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient orbs
    const orbs = [
      { x: 0.2, y: 0.3, radius: 300, color: 'rgba(123, 92, 246, 0.15)' },
      { x: 0.8, y: 0.6, radius: 350, color: 'rgba(0, 212, 255, 0.12)' },
      { x: 0.5, y: 0.8, radius: 280, color: 'rgba(139, 92, 246, 0.13)' },
    ];

    const animate = () => {
      time += 0.005;
      
      // Clear with dark background
      ctx.fillStyle = '#02030a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated gradient orbs
      orbs.forEach((orb, index) => {
        const offsetX = Math.sin(time + index * 2) * 50;
        const offsetY = Math.cos(time + index * 2) * 50;
        
        const gradient = ctx.createRadialGradient(
          canvas.width * orb.x + offsetX,
          canvas.height * orb.y + offsetY,
          0,
          canvas.width * orb.x + offsetX,
          canvas.height * orb.y + offsetY,
          orb.radius
        );
        
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(123, 92, 246, 0.05)'; // Increased opacity
      ctx.lineWidth = 1;
      
      const gridSize = 60; // Smaller grid
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      {/* Gradient overlay for depth */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(2, 3, 10, 0.5) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles - Enhanced */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {[...Array(60)].map((_, i) => { // Increased count
          const size = 2 + Math.random() * 4;
          const startX = Math.random() * 100; 
          const startY = 50 + Math.random() * 60; 
          const endY = -10; 
          const duration = 10 + Math.random() * 15; // Faster
          const delay = Math.random() * 5;
          return (
            <motion.div
              key={i}
              initial={{
                left: `${startX}%`,
                top: `${startY}%`,
                opacity: 0,
              }}
              animate={{
                top: `${endY}%`,
                opacity: [0, 0.8, 0.6, 0], // Brighter
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay,
                times: [0, 0.1, 0.8, 1],
              }}
              style={{
                position: 'fixed',
                width: size,
                height: size,
                borderRadius: '50%',
                background: i % 3 === 0
                  ? 'radial-gradient(circle, rgba(123, 92, 246, 0.9), transparent)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, rgba(0, 212, 255, 0.9), transparent)'
                  : 'radial-gradient(circle, rgba(139, 92, 246, 0.9), transparent)',
                boxShadow: `0 0 ${size * 4}px ${i % 3 === 0 ? 'rgba(123, 92, 246, 0.6)' : i % 3 === 1 ? 'rgba(0, 212, 255, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
              }}
            />
          );
        })}
      </div>

    </>
  );
};

export default PremiumBackground;
