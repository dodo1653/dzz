import React, { useEffect, useRef } from 'react';
// Inline fallback for MotionSection to avoid missing file errors
const MotionSection = ({ as, children, ...rest }) => {
  const Tag = as || 'section';
  return <Tag {...rest}>{children}</Tag>;
};

const ContactPage = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Discord SVG Icon Component
  const DiscordIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-.99 0-1.8-.9-1.8-2.02c0-1.11.78-2.03 1.8-2.03c1.01 0 1.8.92 1.8 2.03c0 1.12-.79 2.02-1.8 2.02zm6.97 0c-.99 0-1.8-.9-1.8-2.02c0-1.11.78-2.03 1.8-2.03c1.01 0 1.8.92 1.8 2.03c0 1.12-.79 2.02-1.8 2.02z"/>
    </svg>
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle system for antigravity effect
    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 123 + 132)}, ${Math.floor(Math.random() * 92 + 164)}, ${Math.floor(Math.random() * 246 + 9)}, ${Math.random() * 0.5 + 0.1})`;
        this.originalSize = this.size;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x <= 0 || this.x >= width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= height) this.speedY *= -1;

        // Pulsing effect
        this.size = this.originalSize + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw connecting lines between close particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(123, 92, 246, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle gradient background
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, 'rgba(2, 3, 10, 0.3)');
      gradient.addColorStop(1, 'rgba(2, 3, 10, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Antigravity background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content overlay */}
      <MotionSection as="div" style={{
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: "'Archivo', 'Inter', sans-serif",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 500,
          background: 'linear-gradient(135deg, rgba(220,215,255,0.95) 0%, rgba(180,200,255,0.85) 50%, rgba(160,220,255,0.9) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem',
          letterSpacing: '-0.03em',
          filter: 'drop-shadow(0 0 25px rgba(200,215,255,0.3)) drop-shadow(0 0 50px rgba(180,200,255,0.2))'
        }}>
          Join Our Community
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '1.1rem',
          fontFamily: "'Sora', sans-serif",
          lineHeight: '1.7',
          marginBottom: '3rem'
        }}>
          Connect with fellow traders and get real-time updates in our Discord community.
        </div>

        {/* Discord-focused section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Discord Server Preview */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(123, 92, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: 'linear-gradient(135deg, rgba(10, 5, 30, 0.9), rgba(5, 2, 20, 0.95))',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <DiscordIcon size={64} color="#7289da" />
            <div style={{
              marginTop: '1rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: "'Space Grotesk', 'Sora', sans-serif",
            }}>
              Join Our Discord Server
            </div>
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: "'Space Grotesk', 'Sora', sans-serif",
            }}>
              Connect with the community
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(10, 5, 30, 0.85), rgba(5, 2, 20, 0.95))',
            border: '1px solid rgba(123, 92, 246, 0.3)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <DiscordIcon size={48} color="#7289da" />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.5rem',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
              }}>
                Discord Community
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1rem',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
              }}>
                Join for live discussions and alpha
              </div>
            </div>
          </div>

          <a
            href="https://discord.gg/Y3uh3hN2"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #7289da, #5865F2)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              fontFamily: "'Sora', sans-serif",
              textDecoration: 'none',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(114, 137, 218, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 30px rgba(114, 137, 218, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(114, 137, 218, 0.3)';
            }}
          >
            <DiscordIcon size={24} color="white" />
            Join Discord
          </a>
        </div>

        {/* Additional contact options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: 'white'
            }}>
              Support
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              support@degenradar.ai
            </div>
          </div>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: 'white'
            }}>
              Business
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              business@degenradar.ai
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
};

export default ContactPage;
