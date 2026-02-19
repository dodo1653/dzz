import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      time += 0.005;
      
      ctx.fillStyle = '#02030a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        {[...Array(50)].map((_, i) => {
          const width = 1 + Math.random() * 2;
          const height = width * (3 + Math.random() * 4);
          const startX = Math.random() * 100;
          const startY = 110;
          const duration = 25 + Math.random() * 20;
          const delay = Math.random() * 15;
          return (
            <motion.div
              key={i}
              initial={{
                left: `${startX}%`,
                top: `${startY}%`,
                opacity: 0,
              }}
              animate={{
                top: '-20%',
                opacity: [0, 0.6, 0.4, 0],
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
                width,
                height,
                borderRadius: '2px',
                background: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.4)',
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default AnimatedBackground;
