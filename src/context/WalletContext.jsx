import React, { createContext, useContext } from 'react';

const WalletContext = createContext();

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

// This context provider now receives the values as props from a parent component
export const WalletContextProvider = ({ children, isWalletConnected, publicKey, connectionStatus }) => {
  const value = {
    isWalletConnected,
    publicKey,
    connectionStatus
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};