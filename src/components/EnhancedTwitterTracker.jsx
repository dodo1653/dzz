import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockTweets = [
  { id: '1', username: 'elonmusk', name: 'Elon Musk', text: 'Just deployed a new token on pump.fun $TESLA 🚀', time: '2m ago', isPumpSignal: true },
  { id: '2', username: 'solana', name: 'Solana', text: 'Ecosystem growth continues. Intercepting new signals.', time: '5m ago', isPumpSignal: false },
  { id: '3', username: 'pumpdotfun', name: 'pump.fun', text: 'High velocity detected in sector 7.', time: '8m ago', isPumpSignal: true }
];

const EnhancedTwitterTracker = () => {
  const [tweets] = useState(mockTweets);
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#02030a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12"><h1 className="text-5xl md:text-7xl font-black holographic-text uppercase tracking-tighter mb-4">Social Intercept</h1><p className="text-cyan-400/50 font-mono text-xs uppercase tracking-[0.5em]">Neural-net surveillance of KOL activity</p></header>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6"><div className="glass-2077 p-6 border-cyan-400/20"><h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Active Surveillance</h3><div className="space-y-2">{['elonmusk', 'solana', 'pumpdotfun'].map(source => (<div key={source} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 text-[10px] font-mono"><span className="text-cyan-400">@{source}</span><span className="text-green-500 animate-pulse">SYNCED</span></div>))}</div></div></div>
          <div className="lg:col-span-2 space-y-6">
            {tweets.map((tweet, i) => (
              <motion.div key={tweet.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`glass-2077 p-6 border-white/5 relative group ${tweet.isPumpSignal ? 'border-l-4 border-l-cyan-400' : ''}`}>
                <div className="flex justify-between items-start mb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-black">{tweet.name[0]}</div><div><h4 className="text-sm font-black text-white uppercase tracking-tighter">{tweet.name}</h4><p className="text-[10px] text-cyan-400 font-mono">@{tweet.username} // {tweet.time}</p></div></div>{tweet.isPumpSignal && (<div className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 text-[8px] font-black text-cyan-400 uppercase tracking-widest">Signal Detected</div>)}</div>
                <p className="text-xs text-gray-300 font-mono leading-relaxed mb-6">{tweet.text}</p>
                <div className="flex gap-6 pt-4 border-t border-white/5"><div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Auth: Verified</div><div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Relay: Secure</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTwitterTracker;
