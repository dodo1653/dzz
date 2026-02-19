import React, { useEffect, useRef } from 'react';

const AntigravityParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouseX = -100;
    let mouseY = -100;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Set canvas size
    const resizeCanvas = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      canvas.width = windowWidth;
      canvas.height = windowHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = -100;
      mouseY = -100;
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseX = -100;
      mouseY = -100;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * windowWidth;
        this.y = Math.random() * windowHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.originalSize = this.size;
        this.oscillation = Math.random() * Math.PI * 2;
        this.oscillationSpeed = 0.01 + Math.random() * 0.02;
        this.color = `rgba(155, 124, 246, ${0.1 + Math.random() * 0.3})`;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.005 + Math.random() * 0.01;
      }

      update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = windowWidth;
        if (this.x > windowWidth) this.x = 0;
        if (this.y < 0) this.y = windowHeight;
        if (this.y > windowHeight) this.y = 0;

        // Oscillate size
        this.oscillation += this.oscillationSpeed;
        this.size = this.originalSize + Math.sin(this.oscillation) * 0.3;

        // Pulsing effect
        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase) * 0.1 + 1;
        this.currentSize = this.size * pulse;

        // Mouse interaction
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
          this.currentSize = this.size * (1 + force * 0.5);
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    const particleCount = Math.floor((windowWidth * windowHeight) / 5000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, windowWidth, windowHeight);

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = 1 - distance / 100;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(155, 124, 246, ${opacity * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        particles[i].update();
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.7,
      }}
    />
  );
};

export default AntigravityParticlesBackground;