import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Verance-style animation wrapper component
const VeranceAnimate = ({ children, className = "", type = "fade-up", delay = 0, duration = 0.4 }) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: duration, 
        ease: [0.2, 0.0, 0.2, 1], // Smooth ease-out
        delay: delay 
      }
    }
  };

  return (
    <motion.div
      ref={elementRef}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax background component
const ParallaxBackground = ({ children, speed = 0.5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrolled = window.scrollY;
      const rate = scrolled * speed;
      containerRef.current.style.transform = `translateY(${rate * -1}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={containerRef} style={{ transform: 'translateY(0px)' }}>
      {children}
    </div>
  );
};

// Enhanced feature card with Verance-style animations
const VeranceFeatureCard = ({ title, description, icon, index }) => {
  const cardRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimated) {
          setIsAnimated(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isAnimated]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isAnimated ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        ease: [0.2, 0.0, 0.2, 1],
        delay: index * 0.1 
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: [0.2, 0.0, 0.2, 1] }
      }}
      style={{
        background: 'rgba(20, 20, 30, 0.6)',
        border: '1px solid rgba(80, 80, 120, 0.2)',
        borderRadius: '16px',
        padding: '1.5rem',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, background 0.3s ease, border 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(30, 30, 45, 0.7)';
        e.currentTarget.style.borderColor = 'rgba(100, 100, 150, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(20, 20, 30, 0.6)';
        e.currentTarget.style.borderColor = 'rgba(80, 80, 120, 0.2)';
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <span style={{ fontSize: '1.25rem', color: 'white' }}>{icon}</span>
      </div>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: 500,
        color: '#EDE9FE',
        marginBottom: '0.5rem',
        fontFamily: "'Inter', sans-serif",
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.9rem',
        color: '#CBD5E1',
        fontFamily: "'Inter', sans-serif",
        lineHeight: '1.5',
      }}>
        {description}
      </p>
    </motion.div>
  );
};

// Liquid navigation dots component
const LiquidNavigationDots = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'pricing'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      if (window.__lenis) {
        window.__lenis.scrollTo(offsetTop, { 
          duration: 2.0, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      } else {
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '40px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      zIndex: 1000,
      pointerEvents: 'auto',
    }}>
      {[
        { id: 'home', label: 'Home' },
        { id: 'features', label: 'Features' },
        { id: 'pricing', label: 'Pricing' },
      ].map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: activeSection === section.id 
              ? 'linear-gradient(135deg, #4F46E5, #0EA5E9)' 
              : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.4)';
              e.target.style.transform = 'scale(1.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6, #0EA5E9)',
            transform: activeSection === section.id ? 'scale(1.2)' : 'scale(0)',
            transition: 'transform 0.3s ease',
          }} />
        </button>
      ))}
    </div>
  );
};

export { VeranceAnimate, ParallaxBackground, VeranceFeatureCard, LiquidNavigationDots };