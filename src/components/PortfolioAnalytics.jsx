import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AssetIntel = () => {
  const holdings = [{ name: 'NEURAL-LINK', symbol: 'NLINK', value: '$45,678', pnl: '+17.6%', pnlColor: 'text-green-400' }, { name: 'CYBER-TRUCK', symbol: 'CTRK', value: '$32,150', pnl: '+7.2%', pnlColor: 'text-green-400' }, { name: 'VOID-RAID', symbol: 'VOID', value: '$28,950', pnl: '-1.9%', pnlColor: 'text-red-500' }];
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#02030a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12"><h1 className="text-5xl md:text-7xl font-black holographic-text uppercase tracking-tighter mb-4">Asset Intel</h1><p className="text-cyan-400/50 font-mono text-xs uppercase tracking-[0.5em]">Real-time equity forensics</p></header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"><div className="glass-2077 p-6 border-cyan-400/20"><p className="text-[10px] text-cyan-400/40 uppercase font-bold tracking-widest mb-2">Net Worth</p><p className="text-4xl font-black text-white">$125,430.75</p><div className="mt-4 text-[10px] font-mono text-green-400 uppercase tracking-widest">+2.3% // Cycle Gain</div></div><div className="glass-2077 p-6 border-white/5"><p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Win Rate</p><p className="text-4xl font-black text-white">78%</p><div className="mt-4 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Tactical Efficiency</div></div><div className="glass-2077 p-6 border-white/5"><p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Holdings</p><p className="text-4xl font-black text-white">12</p><div className="mt-4 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Live Surveillance</div></div></div>
        <div className="grid lg:grid-cols-2 gap-8"><div className="glass-2077 p-8 border-white/5 relative min-h-[400px]"><h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2"><div className="w-2 h-2 bg-cyan-400 animate-pulse" /> Equity Velocity</h3><div className="absolute inset-x-8 bottom-8 top-24 border-l border-b border-white/10 flex items-end gap-1 px-2">{[...Array(20)].map((_, i) => (<motion.div key={i} initial={{ height: 0 }} animate={{ height: `${20 + Math.random() * 80}%` }} className="flex-1 bg-gradient-to-t from-cyan-400/20 to-cyan-400/60" />))}</div></div><div className="glass-2077 p-8 border-white/5"><h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Signal Allocation</h3><div className="space-y-4">{holdings.map((h, i) => (<div key={i} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center relative overflow-hidden group hover:border-cyan-400/30 transition-all"><div><p className="text-sm font-black text-white uppercase tracking-tighter">{h.name}</p><p className="text-[10px] text-cyan-400 font-mono tracking-widest">${h.symbol}</p></div><div className="text-right"><p className="text-sm font-black text-white">{h.value}</p><p className={`text-[8px] font-bold uppercase tracking-widest ${h.pnlColor}`}>{h.pnl}</p></div></div>))}</div></div></div>
      </div>
    </div>
  );
};

export default AssetIntel;
