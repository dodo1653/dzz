import React, { useState, useEffect, useRef, memo } from "react";

const TypingText = memo(function TypingText({
  text,
  speed = 35,
  delay = 400,
  triggerOnScroll = true  // Changed default to true for scroll-triggered animations
}) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isInView, setIsInView] = useState(!triggerOnScroll);
  const textRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const currentIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (triggerOnScroll) {
      // Reset state when component mounts
      setIsInView(false);
      setDisplayText("");
      currentIndexRef.current = 0;

      // Use IntersectionObserver to detect when element enters viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              // Disconnect observer after first intersection to prevent re-triggering
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of element is visible
          rootMargin: '0px 0px -100px 0px' // Trigger slightly before element enters viewport
        }
      );

      if (textRef.current) {
        observer.observe(textRef.current);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      setIsInView(true);
    }
  }, [triggerOnScroll]);

  useEffect(() => {
    if (!isInView) return;

    // Reset state
    setDisplayText("");
    setCursorVisible(true);
    currentIndexRef.current = 0;

    // Start typing after delay
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;

        const elapsed = timestamp - startTimeRef.current;
        // Variable speed for more natural typing feel - faster at start, slower at end
        const progressRatio = currentIndexRef.current / text.length;
        const speedVariation = 0.7 + progressRatio * 0.6;
        const targetIndex = Math.min(Math.floor(elapsed / (speed * speedVariation)), text.length);

        if (targetIndex > currentIndexRef.current) {
          currentIndexRef.current = targetIndex;
          setDisplayText(text.substring(0, targetIndex));

          if (targetIndex >= text.length) {
            // Turn off cursor after completion
            setTimeout(() => setCursorVisible(false), 300);
            return; // Stop animation loop
          }
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      startTimeRef.current = null;
      currentIndexRef.current = 0;
    };
  }, [isInView, text, delay, speed]);

  return (
    <span
      ref={textRef}
      className="typing-root glow-typing"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'pre-wrap',
        opacity: 1,
        visibility: 'visible',
      }}
    >
      <span
        className="typing-text"
        style={{
          color: 'inherit',
          opacity: displayText.length > 0 ? 1 : 0,
          filter: displayText.length > 0 ? 'blur(0px)' : 'blur(4px)',
          transition: 'opacity 0.5s ease-out, filter 0.5s ease-out',
          minHeight: '1.2em',
        }}
      >
        {displayText}
      </span>
      <span
        className="typing-cursor"
        style={{
          width: '2px',
          height: '1em',
          marginLeft: '4px',
          background: 'currentcolor',
          opacity: cursorVisible ? 1 : 0,
          transform: cursorVisible ? 'scaleY(1)' : 'scaleY(0)',
          willChange: 'opacity, transform',
          animation: cursorVisible ? 'blink 0.8s infinite, cursorFadeIn 0.3s ease-out' : 'cursorFadeOut 0.2s ease-out',
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: cursorVisible ? '0 0 8px currentcolor' : 'none',
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(0.8); }
        }
        @keyframes cursorFadeIn {
          from { opacity: 0; transform: scaleY(0); }
          to { opacity: 1; transform: scaleY(1); }
        }
        @keyframes cursorFadeOut {
          from { opacity: 1; transform: scaleY(1); }
          to { opacity: 0; transform: scaleY(0); }
        }
      `}</style>
    </span>
  );
});

export default TypingText;
