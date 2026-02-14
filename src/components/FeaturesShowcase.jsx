import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FeatureCard = ({ feature, isReversed }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-16`}
    >
      {/* Content */}
      <div className="flex-1 space-y-6">
        <div 
          className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ 
            background: `${feature.accentColor}20`, 
            color: feature.accentColor,
            border: `1px solid ${feature.accentColor}30` 
          }}
        >
          {feature.badge}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {feature.title}
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
          {feature.description}
        </p>
        
        {/* Feature points */}
        <ul className="space-y-3 pt-4">
          {feature.points.map((point, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-300">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: feature.accentColor }} 
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual / Graphic Side */}
      <div className="flex-1 w-full max-w-xl">
        <div 
          className="relative aspect-video rounded-3xl overflow-hidden group"
          style={{ 
            background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        >
          {/* Glass Overlay with Dynamic Glow */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${feature.accentColor} 0%, transparent 70%)`
            }} 
          />
          
          {/* Feature-specific mock visual */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="w-full h-full border border-white/5 rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden">
               {feature.visual}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesShowcase = () => {
  const features = [
    {
      badge: "AI Intelligence",
      title: "Track KOLs Before They Pump",
      description: "Our advanced AI agents monitor thousands of influencer wallets and social signals in real-time, delivering actionable alpha before it hits the mainstream.",
      points: [
        "Real-time wallet monitoring",
        "Social sentiment analysis",
        "KOL profitability scoring"
      ],
      accentColor: "#7b5cf6",
      visual: (
        <div className="flex flex-col gap-4 w-full px-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-8 w-full bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
           ))}
        </div>
      )
    },
    {
      badge: "Risk Protection",
      title: "AI-Powered Rug Detection",
      description: "Invest with confidence. Our neural networks analyze contract code, developer history, and liquidity patterns to score every new launch for safety.",
      points: [
        "Honeypot detection",
        "Liquidity lock verification",
        "Contract vulnerability scans"
      ],
      accentColor: "#00d4ff",
      visual: (
        <div className="relative w-32 h-32">
           <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full" />
           <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center font-bold text-cyan-400">89%</div>
        </div>
      )
    },
    {
      badge: "Real-time Edge",
      title: "Pump.fun Stealth Monitor",
      description: "Get the drop on every new coin created on pump.fun. Filter by volume, holders, and creator reputation to find the gems in the noise.",
      points: [
        "Instant launch alerts",
        "Advanced volume filters",
        "Developer trust scores"
      ],
      accentColor: "#ff00e5",
      visual: (
        <div className="grid grid-cols-3 gap-2 w-full px-12">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="aspect-square bg-white/5 rounded-md border border-white/5" />
           ))}
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          Unfair Advantage for Degens
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl">
          Powered by custom LLMs and real-time indexing, we bring professional-grade data to the retail trenches.
        </p>
      </div>

      <div className="space-y-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            feature={feature} 
            isReversed={index % 2 === 1} 
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesShowcase;
