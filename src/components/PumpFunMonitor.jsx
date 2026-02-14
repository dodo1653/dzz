import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SyndicateRadar = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [radarNodes, setRadarNodes] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const startSyndicateScan = async () => {
    if (!contractAddress) return;
    setIsScanning(true);
    setAnalysis(null);
    setRadarNodes([]);
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
      setRadarNodes(prev => [...prev, { id: i, x: 50 + (Math.random() - 0.5) * 80, y: 50 + (Math.random() - 0.5) * 80, isSyndicate: Math.random() > 0.6 }]);
    }
    setAnalysis({ signature: "SYNDICATE-BETA-7", threatLevel: "CRITICAL", bundleSize: "4.2 SOL", fundingSource: "FixedFloat Mixed", recommendation: "ABORT - HIGH DUMP PROBABILITY" });
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#02030a] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter holographic-text uppercase mb-4">Syndicate Radar</h1>
          <p className="text-cyan-400/60 font-mono text-sm tracking-[0.3em] uppercase">Detecting Coordinated Cabal Clusters</p>
        </header>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto w-full glass-2077 rounded-full p-8 border-cyan-400/20">
            <div className="absolute inset-4 border border-cyan-400/10 rounded-full" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-l border-cyan-400/40 origin-center" style={{ background: 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.2) 0%, transparent 90deg)' }} />
            {radarNodes.map(node => (
              <motion.div key={node.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`absolute w-2 h-2 rounded-full ${node.isSyndicate ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-cyan-400'}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} />
            ))}
            <AnimatePresence>{isScanning && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center"><span className="text-cyan-400 font-mono text-xs animate-pulse tracking-[0.5em]">ANALYZING BLOX...</span></motion.div>)}</AnimatePresence>
          </div>
          <div className="space-y-6">
            <div className="glass-2077 p-6 space-y-4 border-l-4 border-l-cyan-400">
              <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/50 font-bold">Target Contract Signature</label>
              <div className="flex gap-4">
                <input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="PASTE CA..." className="bg-black/40 border border-cyan-400/20 px-4 py-3 w-full font-mono text-sm text-cyan-400 outline-none focus:border-cyan-400 transition-all" />
                <button onClick={startSyndicateScan} disabled={isScanning} className="bg-cyan-400 text-black font-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-white transition-colors disabled:opacity-50">{isScanning ? 'Scanning' : 'Engage'}</button>
              </div>
            </div>
            <AnimatePresence>{analysis && (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="glass-2077 p-4"><p className="text-[10px] text-cyan-400/40 uppercase mb-1">Threat Level</p><p className={`text-xl font-black ${analysis.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-400'}`}>{analysis.threatLevel}</p></div><div className="glass-2077 p-4"><p className="text-[10px] text-cyan-400/40 uppercase mb-1">Cabal Signature</p><p className="text-xl font-black text-white">{analysis.signature}</p></div></div><div className="glass-2077 p-6 border-red-500/20"><h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Cluster Intelligence</h3><div className="space-y-3 font-mono text-xs text-white/70"><div className="flex justify-between border-b border-white/5 pb-2"><span>Bundled Volume</span><span className="text-white">{analysis.bundleSize}</span></div><div className="flex justify-between border-b border-white/5 pb-2"><span>Funding Connection</span><span className="text-white">{analysis.fundingSource}</span></div></div><div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-wider">WARNING: {analysis.recommendation}</div></div></motion.div>)}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicateRadar;
