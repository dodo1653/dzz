import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AssetForge = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#02030a] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 text-center"><h1 className="text-5xl md:text-7xl font-black holographic-text uppercase tracking-tighter mb-4">Asset Forge</h1><p className="text-cyan-400/50 font-mono text-xs uppercase tracking-[0.5em]">Direct on-chain token synthesis</p></header>
        <div className="glass-2077 p-10 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2"><label className="text-[10px] uppercase font-black text-cyan-400/50 tracking-widest">Token Identity</label><input placeholder="NAME_REQUIRED..." className="bg-black/40 border border-white/10 px-4 py-4 w-full font-mono text-sm text-white outline-none focus:border-cyan-400 transition-all" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase font-black text-cyan-400/50 tracking-widest">Ticker Symbol</label><input placeholder="SYMBOL_REQUIRED..." className="bg-black/40 border border-white/10 px-4 py-4 w-full font-mono text-sm text-white outline-none focus:border-cyan-400 transition-all" /></div>
            </div>
            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-cyan-400/50 tracking-widest">Neural Description</label><textarea rows="4" placeholder="DEFINE_MANIFESTO..." className="bg-black/40 border border-white/10 px-4 py-4 w-full font-mono text-sm text-white outline-none focus:border-cyan-400 transition-all resize-none" /></div>
            <div className="pt-8 border-t border-white/5 flex justify-between items-center"><div className="text-[10px] font-mono text-white/30 uppercase">Fee: <span className="text-cyan-400">0.02 SOL</span> // Network: Mainnet</div><button className="bg-cyan-400 text-black font-black px-12 py-4 uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">Initialize Synthesis</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssetForge;
