import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useTransform as useTransformMotion } from 'framer-motion';
import HolographicTerminal from './HolographicTerminal';
import TypingText from '../TypingText';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const stats = [
  { label: 'wallets tracked', value: '2,847' },
  { label: 'signals detected', value: '23' },
  { label: 'uptime', value: '99.9%' },
];

const activityItems = [
  { action: 'wallet scan', target: '0x7a2f...3b1c', time: '2s ago', type: 'scan' },
  { action: 'bundle detected', target: 'BONK2', time: '15s ago', type: 'alert' },
  { action: 'risk alert', target: '0x9c4e...8d2f', time: '32s ago', type: 'risk' },
  { action: 'kol signal', target: '@elonmusk', time: '1m ago', type: 'signal' },
];

const HeroSection = memo(function HeroSection({
  title = "AI DEGEN RADAR",
  tagline = "AI-powered pump.fun tracking. Never miss a launch.",
  onTitleRevealComplete,
  children,
}) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const containerRef = useRef(null);
  const activityRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.15, 0.08, 0]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  const activityMouseX = useMotionValue(0);
  const activityMouseY = useMotionValue(0);
  const activityRotateX = useSpring(useTransformMotion(activityMouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const activityRotateY = useSpring(useTransformMotion(activityMouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleActivityMouseMove = (e) => {
    if (reducedMotion || isMobile) return;
    const rect = activityRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    activityMouseX.set(x);
    activityMouseY.set(y);
  };

  const handleActivityMouseLeave = () => {
    activityMouseX.set(0);
    activityMouseY.set(0);
  };

  useEffect(() => {
    if (reducedMotion) {
      setTitleComplete(true);
      setShowContent(true);
      onTitleRevealComplete?.();
      return;
    }

    setTitleComplete(true);
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, [reducedMotion, onTitleRevealComplete]);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Parallax "is this you?" Background */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: parallaxY,
          opacity: parallaxOpacity,
          scale: parallaxScale,
          zIndex: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(8rem, 25vw, 20rem)',
          fontWeight: 700,
          color: 'transparent',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
          textTransform: 'lowercase',
        }}>
          is this you?
        </span>
      </motion.div>

      {/* Animated Background Orbs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(147, 130, 255, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(130, 200, 255, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '30%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(180, 160, 255, 0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 80px' : '140px 40px 100px',
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: '900px' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}
          >
            dzz
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.2em',
              marginBottom: '3rem',
              textTransform: 'lowercase',
            }}
          >
            v2.0 — live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              marginBottom: '1.5rem',
            }}
          >
            stop guessing.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, rgba(147, 130, 255, 0.7), rgba(130, 200, 255, 0.6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              start knowing.
            </span>
          </motion.h1>

          <AnimatePresence>
            {titleComplete && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: 1.7,
                  marginBottom: '3rem',
                }}
              >
                <TypingText text={tagline} speed={25} delay={100} triggerOnScroll={false} />
              </motion.p>
            )}
          </AnimatePresence>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? '2rem' : '4rem',
              marginBottom: '4rem',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1.8rem',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.3)',
                  letterSpacing: '0.08em',
                  marginTop: '0.35rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Wallet Card - Now First and Expanded */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                width: '100%',
                maxWidth: '720px',
                marginBottom: '2.5rem',
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal + Activity Panel - Now Below */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '900px',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'flex-start',
              }}
            >
              <HolographicTerminal width={isMobile ? 340 : 400} height={isMobile ? 320 : 380} />
              
              {/* Activity Panel with Tilt Effects */}
              <div
                style={{
                  perspective: 1000,
                  transformStyle: 'preserve-3d',
                  width: isMobile ? '340px' : '360px',
                }}
              >
                <motion.div
                  ref={activityRef}
                  onMouseMove={handleActivityMouseMove}
                  onMouseLeave={handleActivityMouseLeave}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    background: 'linear-gradient(165deg, rgba(12, 12, 22, 0.85), rgba(6, 6, 14, 0.9))',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    rotateX: reducedMotion || isMobile ? 0 : activityRotateX,
                    rotateY: reducedMotion || isMobile ? 0 : activityRotateY,
                    transformStyle: 'preserve-3d',
                  }}
                >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'rgba(130, 255, 180, 0.6)',
                      boxShadow: '0 0 10px rgba(130, 255, 180, 0.4)',
                    }}
                  />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}>
                    live activity
                  </span>
                </div>

                {activityItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ 
                      x: 4, 
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                    onClick={() => setExpandedActivity(expandedActivity === i ? null : i)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '10px',
                      border: expandedActivity === i ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        color: expandedActivity === i ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                        marginBottom: '0.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}>
                        {item.type === 'alert' && (
                          <span style={{ color: 'rgba(255, 200, 100, 0.7)' }}>!</span>
                        )}
                        {item.type === 'risk' && (
                          <span style={{ color: 'rgba(255, 100, 100, 0.7)' }}>!</span>
                        )}
                        {item.action}
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.3)',
                      }}>
                        {item.target}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: 'rgba(255, 255, 255, 0.25)',
                    }}>
                      {item.time}
                    </span>
                  </motion.div>
                ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default HeroSection;
