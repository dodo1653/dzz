import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useTransform as useTransformMotion, useInView } from 'framer-motion';
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

const TypingCharText = memo(function TypingCharText({ text, delay = 0, charDelay = 0.04, gradient = false }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  return (
    <span ref={ref} style={{ display: 'inline-flex', overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * charDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ 
            display: 'inline-block',
            background: gradient ? 'linear-gradient(135deg, rgba(100, 140, 180, 0.8), rgba(80, 120, 160, 0.6))' : 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'unset',
            WebkitTextFillColor: gradient ? 'transparent' : 'unset',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
});

const HeroSection = function HeroSection({
  title = "AI DEGEN RADAR",
  onTitleRevealComplete,
  children,
}) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [isActivityHovered, setIsActivityHovered] = useState(false);
  const containerRef = useRef(null);
  const activityRef = useRef(null);
  const headerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const headerInView = useInView(headerRef, { amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.15, 0.08, 0]);

  const activityMouseX = useMotionValue(0);
  const activityMouseY = useMotionValue(0);
  const activityRotateX = useSpring(useTransformMotion(activityMouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 15 });
  const activityRotateY = useSpring(useTransformMotion(activityMouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 15 });

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
    setIsActivityHovered(false);
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
      {/* Subtle Background */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: parallaxY,
          opacity: parallaxOpacity,
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
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
          textTransform: 'lowercase',
        }}>
          is this you?
        </span>
      </motion.div>

      {/* Minimal Background Orbs */}
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
            background: 'radial-gradient(circle, rgba(40, 60, 100, 0.06) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(30, 50, 80, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
              color: 'rgba(255, 255, 255, 0.5)',
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
              color: 'rgba(255, 255, 255, 0.25)',
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
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.72)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              marginBottom: '1.5rem',
            }}
          >
            <TypingCharText text="stop guessing." delay={0.4} charDelay={0.055} />
            <br />
            <TypingCharText text="start knowing." delay={1.3} charDelay={0.055} gradient={true} />
          </motion.h1>

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
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '1.8rem',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.25)',
                  letterSpacing: '0.08em',
                  marginTop: '0.35rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Wallet Card */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                width: '100%',
                maxWidth: '720px',
                marginBottom: '6rem',
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal + Activity Panel */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4rem',
                width: '100%',
                maxWidth: '900px',
              }}
            >
              {/* Header */}
              <motion.div
                ref={headerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'default',
                  marginBottom: '1rem',
                }}
              >
                <motion.h2
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.25)',
                    textTransform: 'lowercase',
                    letterSpacing: '0.08em',
                    position: 'relative',
                    display: 'inline-flex',
                    padding: '0.5rem 1rem',
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    <TypingCharText text="make trenching easier." delay={0.5} charDelay={0.05} />
                  </span>
                </motion.h2>
              </motion.div>

              {/* Terminal and Activity Row */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1.5rem',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'center',
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HolographicTerminal width={isMobile ? 340 : 400} height={isMobile ? 320 : 380} />
                </motion.div>
                
                {/* Vertical pump.fun text BETWEEN the cards */}
                {!isMobile && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '380px',
                    padding: '0 0.5rem',
                  }}>
                    {"pump.fun".split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                          duration: 0.4,
                          delay: 1.5 + i * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontSize: '0.6rem',
                          fontWeight: 400,
                          color: 'rgba(255, 255, 255, 0.1)',
                          letterSpacing: '0.15em',
                          display: 'block',
                          lineHeight: '1.4',
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                )}
                
                {/* Activity Panel */}
                <motion.div
                  ref={activityRef}
                  onMouseMove={handleActivityMouseMove}
                  onMouseEnter={() => setIsActivityHovered(true)}
                  onMouseLeave={handleActivityMouseLeave}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: isMobile ? '340px' : '400px',
                    height: isMobile ? 320 : 380,
                    perspective: 1000,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      height: '100%',
                      rotateX: reducedMotion || isMobile ? 0 : activityRotateX,
                      rotateY: reducedMotion || isMobile ? 0 : activityRotateY,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(165deg, rgba(12, 16, 26, 0.98) 0%, rgba(8, 10, 18, 0.98) 100%)',
                        borderRadius: '20px',
                        border: isActivityHovered 
                          ? '1px solid rgba(60, 90, 130, 0.2)' 
                          : '1px solid rgba(255, 255, 255, 0.03)',
                        boxShadow: isActivityHovered 
                          ? '0 30px 60px -20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(40, 60, 100, 0.06)'
                          : '0 20px 50px -20px rgba(0, 0, 0, 0.45)',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      {/* Hover overlay */}
                      <motion.div
                        animate={{ opacity: isActivityHovered ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(ellipse at 30% 0%, rgba(40, 60,100, 0.06) 0%, transparent 50%)',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />

                      {/* Top border glow */}
                      <motion.div
                        animate={{ height: isActivityHovered ? '1px' : '1px' }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(60, 90, 130, 0.3), transparent)',
                          zIndex: 2,
                        }}
                      />

                      {/* Terminal header bar */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '40px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.025)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          gap: '8px',
                          zIndex: 3,
                        }}
                      >
                        <motion.div 
                          animate={isActivityHovered ? { scale: 1.15 } : { scale: 1 }}
                          style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }}
                        />
                        <motion.div 
                          animate={isActivityHovered ? { scale: 1.15 } : { scale: 1 }}
                          transition={{ delay: 0.02 }}
                          style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}
                        />
                        <motion.div 
                          animate={isActivityHovered ? { scale: 1.15 } : { scale: 1 }}
                          transition={{ delay: 0.04 }}
                          style={{ width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'rgba(80, 120, 160, 0.7)',
                            boxShadow: '0 0 8px rgba(80, 120, 160, 0.4)',
                            marginLeft: '12px',
                          }}
                        />
                        <span style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontSize: '11px',
                          color: isActivityHovered ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.3)',
                          letterSpacing: '0.1em',
                          transition: 'color 0.3s ease',
                        }}>
                          LIVE ACTIVITY
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{
                        position: 'absolute',
                        top: '48px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: '16px 20px',
                        overflow: 'hidden',
                        zIndex: 3,
                      }}>
                        {activityItems.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            whileHover={{ x: 6, backgroundColor: 'rgba(80, 120, 160, 0.03)' }}
                            onClick={() => setExpandedActivity(expandedActivity === i ? null : i)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.7rem 0.8rem',
                              marginBottom: '0.4rem',
                              borderRadius: '8px',
                              border: expandedActivity === i ? '1px solid rgba(80, 120, 160, 0.15)' : '1px solid transparent',
                              cursor: 'pointer',
                              background: expandedActivity === i ? 'rgba(80, 120, 160, 0.03)' : 'transparent',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontFamily: "'Archivo', sans-serif",
                                fontSize: '0.68rem',
                                color: expandedActivity === i ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                                marginBottom: '0.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                              }}>
                                {item.type === 'alert' && (
                                  <span style={{ color: 'rgba(160, 120, 80, 0.7)' }}>◆</span>
                                )}
                                {item.type === 'risk' && (
                                  <span style={{ color: 'rgba(160, 80, 80, 0.7)' }}>◆</span>
                                )}
                                {item.type === 'signal' && (
                                  <span style={{ color: 'rgba(80, 120, 160, 0.7)' }}>◆</span>
                                )}
                                {item.action}
                              </div>
                              <div style={{
                                fontFamily: "'Archivo', sans-serif",
                                fontSize: '0.6rem',
                                color: 'rgba(255, 255, 255, 0.25)',
                              }}>
                                {item.target}
                              </div>
                            </div>
                            <span style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontSize: '0.55rem',
                              color: 'rgba(255, 255, 255, 0.2)',
                            }}>
                              {item.time}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
