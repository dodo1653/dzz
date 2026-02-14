import React from "react";

// A CSS-based animated background that's extremely performant
export default function ModernBackground({ 
  particleCount = 8, 
  connectionCount = 12,
  glowIntensity = 0.6 
}) {
  return (
    <div 
      id="twitter-tracker-bg"
      className="modern-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Twitter tracker accent background (keeps contrast, adds blue-ish premium tint)
        background: 'linear-gradient(135deg, rgba(220,215,255,0.16) 0%, rgba(180,200,255,0.10) 50%, rgba(160,220,255,0.14) 100%), linear-gradient(135deg, #02030a 0%, #0a0818 100%)',
      }}
    >
      {/* Animated floating elements (CSS only) */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={`float-${i}`}
          className="floating-element"
          style={{
            position: 'absolute',
            width: `${Math.random() * 80 + 40}px`,
            height: `${Math.random() * 80 + 40}px`,
            background: `radial-gradient(circle, rgba(123,92,246,${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`,
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: `blur(${Math.random() * 10 + 15}px)`,
            animation: `float-${i % 4} ${15 + Math.random() * 20}s infinite ease-in-out`,
            opacity: 0.4 + Math.random() * 0.3,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Subtle grid lines */}
      <div 
        className="grid-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(123, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }}
      />

      {/* Animated connections between points */}
      {Array.from({ length: connectionCount }).map((_, i) => (
        <div
          key={`line-${i}`}
          className="connection-line"
          style={{
            position: 'absolute',
            height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(0, 240, 255, ${0.1 + Math.random() * 0.1}), transparent)`,
            animation: `pulse-line-${i % 3} ${8 + Math.random() * 10}s infinite ease-in-out`,
            transformOrigin: 'left center',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Global glow effect */}
      <div 
        className="glow-overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vmax',
          height: '200vmax',
          background: `radial-gradient(circle at center, rgba(123, 92, 246, ${glowIntensity * 0.08}) 0%, rgba(123, 92, 246, 0) 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: 0.6,
        }}
      />
    </div>
  );
}

// This component also needs to add the keyframes to the document
export function ModernBackgroundStyles() {
  return (
    <style jsx>{`
      @keyframes float-0 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, 20px) rotate(5deg); }
        50% { transform: translate(0, 40px) rotate(0deg); }
        75% { transform: translate(-20px, 20px) rotate(-5deg); }
      }
      
      @keyframes float-1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-30px, 10px) rotate(-3deg); }
        50% { transform: translate(-10px, -30px) rotate(0deg); }
        75% { transform: translate(30px, -10px) rotate(3deg); }
      }
      
      @keyframes float-2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(15px, -25px) rotate(2deg); }
        50% { transform: translate(30px, 0) rotate(0deg); }
        75% { transform: translate(-15px, 15px) rotate(-2deg); }
      }
      
      @keyframes float-3 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-20px, -15px) rotate(-4deg); }
        50% { transform: translate(25px, 25px) rotate(1deg); }
        75% { transform: translate(10px, -30px) rotate(4deg); }
      }
      
      @keyframes pulse-line-0 {
        0%, 100% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(0.3);
          opacity: 0.1;
        }
        50% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(1);
          opacity: 0.4;
        }
      }
      
      @keyframes pulse-line-1 {
        0%, 100% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(0.2);
          opacity: 0.15;
        }
        50% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(0.8);
          opacity: 0.35;
        }
      }
      
      @keyframes pulse-line-2 {
        0%, 100% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(0.1);
          opacity: 0.05;
        }
        50% { 
          transform: rotate(${Math.random() * 360}deg) scaleX(0.9);
          opacity: 0.3;
        }
      }
      
      .modern-background {
        --glow-color: rgba(123, 92, 246, 0.1);
      }
    `}</style>
  );
}