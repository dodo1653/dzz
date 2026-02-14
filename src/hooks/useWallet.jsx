import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    const adapter = new PhantomWalletAdapter();
    await adapter.connect();
    setWallet(adapter);
    setPublicKey(adapter.publicKey);
  };

  const disconnectWallet = () => {
    wallet?.disconnect();
    setWallet(null);
    setPublicKey(null);
    setBalance(null);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=a01e8e12-31d7-4f8d-af9d-3cbe6bac3f11");
        const bal = await connection.getBalance(publicKey);
        setBalance((bal / 1e9).toFixed(2));
      }
    };
    fetchBalance();
  }, [publicKey]);

  return { wallet, publicKey, balance, connectWallet, disconnectWallet };
};
