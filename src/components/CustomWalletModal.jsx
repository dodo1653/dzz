import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

const CustomWalletModal = ({ isOpen, onClose }) => {
  const { wallets, select, connect } = useWallet();
  const [connecting, setConnecting] = useState(null);
  const handleWalletConnect = async (wallet) => {
    setConnecting(wallet.adapter.name);
    try { select(wallet.adapter.name); await connect(); onClose(); } catch (err) { console.error("AUTH_FAILURE", err); } finally { setConnecting(null); }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[20000] flex items-center justify-center p-6 bg-[#02030a]/90 backdrop-blur-2xl" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-2077 p-10 max-w-md w-full border-cyan-400/20 relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5"><motion.div animate={{ y: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-1/2 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" /></div>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" /><div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
            <div className="text-center mb-10"><p className="text-[10px] uppercase tracking-[0.5em] text-cyan-400/50 font-black mb-2">Security Protocol</p><h2 className="text-3xl font-black text-white uppercase tracking-tighter holographic-text">Access Port</h2></div>
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <button key={wallet.adapter.name} onClick={() => handleWalletConnect(wallet)} className="w-full group relative flex items-center gap-5 p-5 bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all">
                  <div className="relative"><img src={wallet.adapter.icon} alt="" className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all" /><div className="absolute -inset-1 border border-cyan-400/0 group-hover:border-cyan-400/40 rounded-sm transition-all" /></div>
                  <div className="flex-1 text-left"><p className="text-sm font-black text-white uppercase tracking-widest">{wallet.adapter.name}</p><p className="text-[9px] text-white/30 uppercase font-mono tracking-tighter">{connecting === wallet.adapter.name ? 'Linking...' : 'Authorization Ready'}</p></div>
                  <div className="w-2 h-2 border border-white/20 group-hover:bg-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_#22d3ee] transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-4"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /><p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.2em]">Secure Cipher Auth Required</p><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomWalletModal;
