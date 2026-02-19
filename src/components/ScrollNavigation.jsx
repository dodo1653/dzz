import React, { useRef, useEffect, useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const GlassDot = memo(function GlassDot({ isActive, onClick, label }) {
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        width: isActive ? '36px' : '14px',
        height: '14px',
        borderRadius: '7px',
        background: isActive 
          ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.4) 0%, rgba(74, 222, 128, 0.15) 100%)'
          : 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isActive 
          ? '1px solid rgba(74, 222, 128, 0.5)' 
          : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isActive 
          ? '0 0 25px rgba(74, 222, 128, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)'
          : '0 0 15px rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          style={{
            position: 'absolute',
            inset: '2px',
            borderRadius: '5px',
            background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.7) 0%, rgba(74, 222, 128, 0.3) 100%)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      {isHovered && label && (
        <motion.span
          initial={{ opacity: 0, x: 10, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.9 }}
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.4rem 0.75rem',
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
});

const ScrollNavigationDots = memo(function ScrollNavigationDots({ sections, activeSection, onSectionClick }) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const scrollToSection = (index) => {
    if (onSectionClick) {
      onSectionClick(index);
      return;
    }
    
    const sectionIds = ['hero', 'demos', 'features', 'pricing'];
    const element = document.getElementById(sectionIds[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed',
        right: isMobile ? '1rem' : '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 1000,
      }}
    >
      {sections.map((section, index) => (
        <GlassDot
          key={section.id}
          isActive={activeSection === index}
          onClick={() => scrollToSection(index)}
          label={section.label}
        />
      ))}
    </motion.div>
  );
});

const icons = {
  radar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" />
    </svg>
  ),
  pulse: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  rocket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  brain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <polyline points="7 14 10 10 13 13 17 8" />
    </svg>
  ),
};

const FeatureCard = memo(function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (e.clientX - centerX) / 20;
    setRotation({ x: -rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        scale: isHovered ? 1.03 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        flexShrink: 0,
        width: '300px',
        padding: '1.5rem',
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: isHovered 
          ? '1px solid rgba(255,255,255,0.15)' 
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isHovered 
          ? `0 25px 50px -15px rgba(0,0,0,0.5), 0 0 40px -10px ${feature.accent}`
          : '0 10px 30px -15px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: feature.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.95)',
          boxShadow: `0 8px 20px ${feature.accent}`,
        }}>
          {icons[feature.icon]}
        </div>
        <h3 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: '1rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.95)',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          {feature.title}
        </h3>
      </div>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: 1.6,
        margin: 0,
      }}>
        {feature.description}
      </p>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'rgba(123, 92, 246, 0.9)',
            letterSpacing: '0.05em',
          }}>
            AI-POWERED
          </span>
        </motion.div>
      )}
    </motion.div>
  );
});

const PremiumFeatureSection = memo(function PremiumFeatureSection({ features }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    
    let animationId;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const position = (elapsed / 40) % (features.length * 340);
      setScrollPosition(position);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [reducedMotion, isMobile, features.length]);
  
  const allFeatures = [...features, ...features];
  
  return (
    <section
      id="features"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 1.5rem' : '5rem 2rem',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          YOUR ARSENAL
        </p>
        <h2 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '-0.02em',
        }}>
          Every tool you need to{' '}
          <span style={{
            background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.95) 0%, rgba(0, 212, 255, 0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>dominate.</span>
        </h2>
      </motion.div>
      
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            padding: isMobile ? '0 1.5rem' : '0 2rem',
            transform: `translateX(-${scrollPosition}px)`,
            transition: reducedMotion || isMobile ? 'none' : 'transform 0.1s linear',
          }}
        >
          {allFeatures.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export { ScrollNavigationDots, PremiumFeatureSection };
