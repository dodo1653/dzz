import React, { useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';

const MacBookFrame = memo(function MacBookFrame({ children, title = 'Terminal', showVolume = true }) {
  const frameRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const rotateX = -mousePos.y * 6;
  const rotateY = mousePos.x * 6;

  return (
    <motion.div
      ref={frameRef}
      onMouseEnter={(e) => { setIsHovered(true); handleMouseMove(e); }}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      animate={{
        rotateX,
        rotateY,
        y: isHovered ? -8 : 0,
        scale: isHovered ? 1.01 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 20,
        mass: 0.5,
      }}
      style={{
        position: 'relative',
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: 12,
            background: 'linear-gradient(180deg, rgba(60, 70, 90, 0.9) 0%, rgba(40, 50, 70, 0.95) 100%)',
            borderRadius: '10px 10px 0 0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: 'none',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 8,
            background: 'linear-gradient(180deg, rgba(100, 110, 130, 0.3) 0%, rgba(80, 90, 110, 0.1) 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <motion.div
          animate={{
            rotateX: isHovered ? 0 : 2,
          }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(180deg, rgba(30, 35, 45, 0.98) 0%, rgba(20, 22, 30, 0.98) 100%)',
            borderRadius: '16px',
            border: isHovered 
              ? '1px solid rgba(100, 140, 180, 0.4)'
              : '1px solid rgba(80, 100, 140, 0.25)',
            boxShadow: isHovered 
              ? '0 40px 80px -20px rgba(0, 0, 0, 0.7), 0 0 60px rgba(80, 100, 140, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 30px 60px -20px rgba(0, 0, 0, 0.6), 0 0 40px rgba(60, 80, 120, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              gap: 8,
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <motion.div 
                animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255, 95, 87, 0.8)' }}
              />
              <motion.div 
                animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                transition={{ delay: 0.02 }}
                style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255, 189, 46, 0.8)' }}
              />
              <motion.div 
                animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                transition={{ delay: 0.04 }}
                style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(40, 202, 65, 0.8)' }}
              />
            </div>
            <div style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              {title}
            </div>
            {showVolume && (
              <div style={{ width: 34, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <motion.div
                  animate={{ opacity: isHovered ? 0.6 : 0.3 }}
                  style={{
                    width: 16,
                    height: 10,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            {children}
            
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                borderRadius: '0 0 16px 16px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            />
          </div>
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: -16,
            left: '10%',
            right: '10%',
            height: 16,
            background: 'linear-gradient(180deg, rgba(40, 50, 65, 0.9) 0%, rgba(30, 38, 50, 0.95) 100%)',
            borderRadius: '0 0 8px 8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '30%',
              height: 6,
              background: 'linear-gradient(180deg, rgba(50, 60, 75, 0.8) 0%, rgba(40, 50, 60, 0.9) 100%)',
              borderRadius: '0 0 4px 4px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderTop: 'none',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
});

export default MacBookFrame;
