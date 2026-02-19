import React, { useEffect, useRef } from "react";

export default function ParticlesBackground({ particleCount = 120 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;
    let particles = [];
    let mouseX = -100;
    let mouseY = -100;
    let mouseRadius = 150;

    function resize() {
      w = window.innerWidth;
      // Calculate full document height for full page coverage
      const totalHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      h = totalHeight;

      canvas.style.width = w + "px";
      canvas.style.height = totalHeight + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(totalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * (document.body.scrollHeight || window.innerHeight * 3), // Spread across full document
          baseY: Math.random() * (document.body.scrollHeight || window.innerHeight * 3), // Store for parallax
          size: 1.0 + Math.random() * 1.8,
          opacity: 0.2 + Math.random() * 0.3,
          hue: 240 + Math.random() * 40 - 20, // Purple-blue-violet range
          pulsePhase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.1,
          frequency: 0.001 + Math.random() * 0.002,
          amplitude: 0.5 + Math.random() * 1.0,
          direction: Math.random() * Math.PI * 2,
        });
      }
    }

    // Track mouse movement for interaction
    function mouseMove(e) {
      mouseX = -100;
      mouseY = -100;
    }

    function mouseLeave() {
      mouseX = -100;
      mouseY = -100;
    }

    function draw(timestamp) {
      // Calculate scroll progress for dynamic background
      const scrollY = window.scrollY;
      const maxScroll = (document.body.scrollHeight || 0) - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      // Dynamic background: darker at top, lighter as you scroll down with gradient
      const bgDarkness = Math.max(8, 25 - (scrollProgress * 10)); // 25 at top, ~15 at bottom
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, `rgba(${Math.floor(bgDarkness * 1.1)}, ${Math.floor(bgDarkness * 0.8)}, ${Math.floor(bgDarkness * 1.0)}, 1)`);
      bgGradient.addColorStop(1, `rgba(${Math.floor(bgDarkness * 0.9)}, ${Math.floor(bgDarkness * 0.7)}, ${Math.floor(bgDarkness * 1.1)}, 1)`);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w * dpr, h * dpr);

      // Draw particles with scroll influence and interaction
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply scroll parallax effect - particles move at different speeds
        const parallaxY = (p.baseY - scrollY * (0.6 + (i % 5) * 0.1)) % (document.body.scrollHeight + 200);
        // More complex movement patterns for premium feel
        const parallaxX = p.x + Math.sin(timestamp * p.frequency + i) * p.amplitude + Math.cos(timestamp * 0.0003) * 0.7;

        // Pulsing effect with more variation
        const pulse = Math.sin(timestamp * 0.002 + p.pulsePhase) * 0.2 + 1.0;
        const currentOpacity = p.opacity * pulse;
        const currentSize = p.size * pulse;

        // Mouse interaction for premium feel
        const dx = parallaxX - mouseX;
        const dy = parallaxY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let interactionX = 0;
        let interactionY = 0;
        let interactionOpacity = currentOpacity;
        let interactionSize = currentSize;

        if (distance < mouseRadius) {
          // Attract particles toward mouse for premium feel
          const angle = Math.atan2(dy, dx);
          const force = Math.min(1, (mouseRadius - distance) / mouseRadius);
          interactionX = -Math.cos(angle) * force * 30;
          interactionY = -Math.sin(angle) * force * 30;
          interactionOpacity = Math.min(0.95, currentOpacity + force * 0.4);
          interactionSize = currentSize + force * 1.2;
        }

        const finalX = parallaxX + interactionX;
        const finalY = parallaxY + interactionY;

        // Draw particle with premium glowing gradient
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          finalX * dpr, finalY * dpr, 0,
          finalX * dpr, finalY * dpr, interactionSize * 1.5 * dpr,
          finalX * dpr, finalY * dpr, interactionSize * 6 * dpr
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 95%, 75%, ${interactionOpacity})`);
        gradient.addColorStop(0.3, `hsla(${p.hue}, 85%, 70%, ${interactionOpacity * 0.7})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(finalX * dpr, finalY * dpr, interactionSize * 6 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw premium connections between nearby particles with scroll influence
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          // Calculate positions with parallax
          const p1Y = (p1.baseY - scrollY * (0.6 + (i % 5) * 0.1)) % (document.body.scrollHeight + 200);
          const p2Y = (p2.baseY - scrollY * (0.6 + (j % 5) * 0.1)) % (document.body.scrollHeight + 200);
          const p1X = p1.x + Math.sin(timestamp * p1.frequency + i) * p1.amplitude;
          const p2X = p2.x + Math.sin(timestamp * p2.frequency + j) * p2.amplitude;

          const dx = p1X - p2X;
          const dy = p1Y - p2Y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = ((1 - distance / 150) * 0.4) * (0.8 + scrollProgress * 0.3); // More visible as you scroll
            const gradient = ctx.createLinearGradient(p1X * dpr, p1Y * dpr, p2X * dpr, p2Y * dpr);
            gradient.addColorStop(0, `hsla(${p1.hue}, 80%, 70%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${p2.hue}, 80%, 70%, ${opacity})`);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.moveTo(p1X * dpr, p1Y * dpr);
            ctx.lineTo(p2X * dpr, p2Y * dpr);
            ctx.stroke();
          }
        }
      }

      // Draw premium floating grid lines for extra premium feel
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = `hsla(240, 60%, 40%, 0.1)`;
      const gridSize = 80;
      const offsetX = (timestamp * 0.02) % gridSize;
      const offsetY = (timestamp * 0.015) % gridSize;

      for (let x = -offsetX; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x * dpr, 0);
        ctx.lineTo(x * dpr, h * dpr);
        ctx.stroke();
      }

      for (let y = -offsetY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y * dpr);
        ctx.lineTo(w * dpr, y * dpr);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    init();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", init, { passive: true });
    window.addEventListener("mousemove", mouseMove, { passive: true });
    window.addEventListener("mouseleave", mouseLeave, { passive: true });

    function onVisibility() {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -2,
        pointerEvents: "none",
        opacity: 1.0,
      }}
    />
  );
}
