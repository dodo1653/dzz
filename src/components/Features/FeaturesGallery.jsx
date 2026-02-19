import React from 'react';
import GlassCard from '../shared/GlassCard';

export default function FeaturesGallery() {
  const features = [
    { title: 'AI Wallet Analysis', description: 'Track degen wallets and trading trends in real-time.' },
    { title: 'Context Engine', description: 'Dynamic alerts and insights for Solana projects.' },
    { title: 'Portfolio Overview', description: 'Monitor your assets and liquidity positions easily.' }
  ];

  return (
    <section className='py-16 flex flex-wrap justify-center gap-8'>
      {features.map((f, i) => (
        <GlassCard key={i} title={f.title} description={f.description} />
      ))}
    </section>
  );
}