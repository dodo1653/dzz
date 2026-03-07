import React, { useEffect, useRef, useState, memo } from 'react';

const CustomCursor = memo(function CustomCursor() {
  const cursorRef = useRef(null);
  const trailingRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const trailingPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trailing = trailingRef.current;
    
    if (!cursor || !trailing) return;

    const handleMouseMove = (e) => {
      position.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverChange = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button';
      
      setIsHovering(!!isInteractive);
    };

    const animate = () => {
      const trailingEase = 0.12;
      
      trailingPosition.current.x += (position.current.x - trailingPosition.current.x) * trailingEase;
      trailingPosition.current.y += (position.current.y - trailingPosition.current.y) * trailingEase;
      
      cursor.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      trailing.style.transform = `translate(${trailingPosition.current.x}px, ${trailingPosition.current.y}px)`;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleHoverChange);
    
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleHoverChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '10px' : '6px',
          height: isHovering ? '10px' : '6px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          pointerEvents: 'none',
          zIndex: 99999,
          marginLeft: isHovering ? -5 : -3,
          marginTop: isHovering ? -5 : -3,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s ease',
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)',
        }}
      />
      <div
        ref={trailingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '36px' : '20px',
          height: isHovering ? '36px' : '20px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          pointerEvents: 'none',
          zIndex: 99998,
          marginLeft: isHovering ? -18 : -10,
          marginTop: isHovering ? -18 : -10,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.25s ease, height 0.25s ease, opacity 0.3s ease',
          backdropFilter: 'blur(1px)',
          background: 'rgba(255, 255, 255, 0.03)',
        }}
      />
      <style>{`
        * { cursor: none !important; }
        a, button, [role="button"], .cursor-pointer { cursor: none !important; }
      `}</style>
    </>
  );
});

export default CustomCursor;
