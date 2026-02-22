import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const AnimatedHeading = memo(function AnimatedHeading({ text, highlightWord, isInView }) {
  const words = text.split(' ');
  const highlightIndex = words.indexOf(highlightWord);
  
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3em' }}>
      {words.map((word, wordIdx) => {
        const isHighlight = wordIdx === highlightIndex;
        return (
          <span key={wordIdx} style={{ display: 'inline-flex', overflow: 'hidden' }}>
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={charIdx}
                initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + (wordIdx * 0.15) + (charIdx * 0.04),
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ 
                  display: 'inline-block',
                  color: isHighlight ? 'rgba(74, 222, 128, 0.9)' : 'rgba(255, 255, 255, 0.88)',
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </span>
  );
});

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
          : '0 0 15px rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
      }}
    >
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

const iconColors = {
  radar: 'rgba(120, 180, 255, 0.85)',
  shield: 'rgba(74, 222, 128, 0.85)',
  pulse: 'rgba(255, 160, 120, 0.85)',
  rocket: 'rgba(180, 140, 255, 0.85)',
  brain: 'rgba(140, 200, 220, 0.85)',
  chart: 'rgba(255, 200, 100, 0.85)',
};

const icons = {
  radar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  pulse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  rocket: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    </svg>
  ),
  brain: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
};

const FeatureCard = memo(function FeatureCard({ feature }) {
  const [isHovered, setIsHovered] = useState(false);
  const iconColor = iconColors[feature.icon] || 'rgba(255, 255, 255, 0.6)';
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flexShrink: 0,
        width: '320px',
        padding: '24px',
        background: isHovered 
          ? 'linear-gradient(165deg, rgba(18, 18, 28, 0.98) 0%, rgba(12, 12, 20, 0.98) 100%)'
          : 'linear-gradient(165deg, rgba(14, 14, 24, 0.92) 0%, rgba(10, 10, 18, 0.95) 100%)',
        borderRadius: '16px',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: isHovered 
          ? '0 24px 48px -16px rgba(0, 0, 0, 0.5)'
          : '0 12px 32px -12px rgba(0, 0, 0, 0.4)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '14px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${iconColor.replace('0.85', '0.15')} 0%, ${iconColor.replace('0.85', '0.05')} 100%)`,
          border: `1px solid ${iconColor.replace('0.85', '0.2')}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          flexShrink: 0,
        }}>
          {icons[feature.icon]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 500,
            color: isHovered ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.75)',
            margin: 0,
            marginBottom: '8px',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}>
            {feature.title}
          </h3>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.38)',
            lineHeight: 1.6,
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const PremiumFeatureSection = memo(function PremiumFeatureSection({ features }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const allFeatures = [...features, ...features, ...features];
  
  return (
    <section
      id="features"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 0' : '5rem 0',
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
          marginBottom: '3.5rem',
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: isMobile ? '0 1.5rem' : '0 2rem',
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.3em',
            marginBottom: '1.25rem',
          }}
        >
          YOUR ARSENAL
        </motion.p>
        <h2 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.88)',
          letterSpacing: '-0.02em',
        }}>
          <AnimatedHeading text="Every tool you need." highlightWord="need." isInView={isInView} />
        </h2>
      </motion.div>
      
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className="features-scroll-container"
          style={{
            display: 'flex',
            gap: '1rem',
            padding: isMobile ? '0 1.5rem' : '0 2rem',
            width: 'max-content',
            animation: reducedMotion || isMobile ? 'none' : 'scroll-features 30s linear infinite',
          }}
        >
          {allFeatures.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </div>
        
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(8, 8, 14, 1) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(-90deg, transparent 0%, rgba(8, 8, 14, 1) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      <style>{`
        @keyframes scroll-features {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${features.length * 340}px); }
        }
        .features-scroll-container:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
});

export { ScrollNavigationDots, PremiumFeatureSection };
