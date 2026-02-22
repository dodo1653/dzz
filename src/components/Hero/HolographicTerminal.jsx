import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const terminalLines = [
  { type: 'status', label: 'SYSTEM STATUS', value: 'ONLINE', color: 'rgba(74, 222, 128, 0.9)' },
  { type: 'stat', label: 'TRACKING', value: '2,847', suffix: ' WALLETS' },
  { type: 'stat', label: 'SIGNALS', value: '23', suffix: ' DETECTED' },
  { type: 'stat', label: 'THREAT LEVEL', value: 'LOW', color: 'rgba(74, 222, 128, 0.9)' },
  { type: 'divider' },
  { type: 'log', text: '> Last signal: @elonmusk mentioned $PEPE', delay: 0 },
  { type: 'log', text: '> Risk scan: 0x7a2f... VERIFIED', delay: 1000 },
  { type: 'log', text: '> New launch: BONK2 - BUNDLE DETECTED', delay: 2000, highlight: true },
  { type: 'log', text: '> Alpha alert: 3 KOLs buying $WIF', delay: 3000 },
];

const HolographicTerminal = memo(function HolographicTerminal({
  width = 600,
  height = 360,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 15 });

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLogs(terminalLines.filter(l => l.type === 'log').length);
      return;
    }

    const logCount = terminalLines.filter(l => l.type === 'log').length;
    let currentLog = 0;

    const interval = setInterval(() => {
      currentLog++;
      setVisibleLogs(currentLog);
      if (currentLog >= logCount) {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const handleMouseMove = (e) => {
    if (reducedMotion || isMobile) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const actualWidth = isMobile ? '95%' : width;
  const actualHeight = isMobile ? 320 : height;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: actualWidth,
        maxWidth: '600px',
        height: actualHeight,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX: reducedMotion || isMobile ? 0 : rotateX,
          rotateY: reducedMotion || isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.9), rgba(5, 5, 15, 0.95))',
            borderRadius: '20px',
            border: isHovered 
              ? '1px solid rgba(100, 140, 180, 0.35)' 
              : '1px solid rgba(123, 92, 246, 0.3)',
            boxShadow: isHovered 
              ? `0 0 0 1px rgba(100, 140, 180, 0.15), 0 28px 56px -20px rgba(0, 0, 0, 0.6), 0 0 50px rgba(100, 140, 180, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 0 0 1px rgba(0, 240, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(123, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(100, 140, 180, 0.06) 0%, transparent 50%, rgba(140, 100, 180, 0.04) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          {!reducedMotion && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
                  pointerEvents: 'none',
                  animation: 'scanlines 8s linear infinite',
                }}
              />
              <motion.div
                animate={{
                  opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, transparent 50%, rgba(123, 92, 246, 0.1) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(123, 92, 246, 0.8), rgba(0, 240, 255, 0.8), transparent)',
              opacity: 0.8,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: '8px',
            }}
          >
            <motion.div 
              animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }}
            />
            <motion.div 
              animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
              transition={{ delay: 0.02 }}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}
            />
            <motion.div 
              animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
              transition={{ delay: 0.04 }}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }}
            />
            <span style={{
              marginLeft: 'auto',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.1em',
            }}>
              RADAR_TERMINAL v2.0
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '16px 20px',
              overflow: 'hidden',
            }}
          >
            {terminalLines.map((line, index) => {
              if (line.type === 'divider') {
                return (
                  <div
                    key={index}
                    style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(123, 92, 246, 0.3), transparent)',
                      margin: '12px 0',
                    }}
                  />
                );
              }

              if (line.type === 'status' || line.type === 'stat') {
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: isMobile ? '11px' : '13px',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{line.label}:</span>
                    <span style={{
                      color: line.color || 'rgba(0, 240, 255, 0.9)',
                      fontWeight: 500,
                      textShadow: `0 0 10px ${line.color || 'rgba(0, 240, 255, 0.9)'}`,
                    }}>
                      {line.value}{line.suffix}
                    </span>
                  </div>
                );
              }

              if (line.type === 'log') {
                const logIndex = terminalLines.slice(0, index).filter(l => l.type === 'log').length;
                const isVisible = reducedMotion || logIndex < visibleLogs;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: isMobile ? '10px' : '12px',
                      color: line.highlight ? 'rgba(255, 193, 7, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {line.highlight && (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ color: 'rgba(255, 193, 7, 0.9)' }}
                      >
                        ⚠
                      </motion.span>
                    )}
                    <span>{line.text}</span>
                  </motion.div>
                );
              }

              return null;
            })}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: 'rgba(0, 240, 255, 0.9)',
                marginTop: '8px',
              }}
            >
              _
            </motion.div>
          </div>

          {!reducedMotion && (
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                y: [0, 200],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.1), transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </motion.div>
  );
});

export default HolographicTerminal;
