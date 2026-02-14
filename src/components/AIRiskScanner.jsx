import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AIRiskScanner = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    { id: 1, address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', tokenName: 'MOONCOIN', timestamp: '2023-05-15T10:30:00Z', riskScore: 23, riskLevel: 'Low', flags: [] },
    { id: 2, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', tokenName: 'RUGTOKEN', timestamp: '2023-05-14T15:45:00Z', riskScore: 87, riskLevel: 'High', flags: ['Owner can mint tokens', 'Owner can freeze accounts'] },
    { id: 3, address: '4VPW5Y8JhPYK6xGUqAVvHc4y3y3FnfRKLfNhwqKG6Bt6', tokenName: 'SAFEPEPE', timestamp: '2023-05-13T09:15:00Z', riskScore: 12, riskLevel: 'Low', flags: [] }
  ]);

  const scanContract = async () => {
    if (!contractAddress) return;
    
    setIsScanning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      address: contractAddress,
      tokenName: contractAddress.substring(0, 8) + '...' + contractAddress.substring(contractAddress.length - 4),
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
      flags: Math.random() > 0.7 ? ['Owner can mint tokens', 'Owner can freeze accounts', 'Hidden backdoor function'] : (Math.random() > 0.4 ? ['Owner can mint tokens'] : []),
      securityFeatures: Math.random() > 0.5 ? ['Verified source code', 'Time-locked liquidity', 'Immutable contract'] : ['Unverified source code'],
      ownership: Math.random() > 0.5 ? 'Renounced' : 'Owner Controlled',
      mintable: Math.random() > 0.5 ? 'Yes' : 'No',
      transferTax: Math.random() > 0.8 ? 'Yes' : 'No',
      lpLocked: Math.random() > 0.5 ? 'Yes' : 'No',
      dexScreener: 'https://dexscreener.com/solana/' + contractAddress,
      solscan: 'https://solscan.io/token/' + contractAddress
    };
    
    setScanResult(mockResults);
    setScanHistory(prev => [
      { 
        id: Date.now(), 
        address: contractAddress, 
        tokenName: mockResults.tokenName, 
        timestamp: new Date().toISOString(),
        riskScore: mockResults.riskScore,
        riskLevel: mockResults.riskLevel,
        flags: mockResults.flags
      },
      ...prev
    ]);
    setIsScanning(false);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return '#00f088';
      case 'Medium': return '#ffaa00';
      case 'High': return '#ff4757';
      default: return '#888888';
    }
  };

  const getRiskBg = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'rgba(0, 240, 136, 0.1)';
      case 'Medium': return 'rgba(255, 170, 0, 0.1)';
      case 'High': return 'rgba(255, 71, 87, 0.1)';
      default: return 'rgba(136, 136, 136, 0.1)';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a051e 0%, #050214 100%)',
      color: 'white',
      paddingTop: '6rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Grid */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 240, 136, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 136, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              fontFamily: "'Inter', 'Archivo', sans-serif",
              fontSize: 'clamp(2.7rem, 6vw, 4.2rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff 0%, #b0f0ff 30%, #00f088 60%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem'
            }}
          >
            AI Risk Scanner
          </motion.h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#d0f0ff', opacity: 0.8, lineHeight: 1.6 }}>
            Scan any Solana token contract with our advanced AI-powered analyzer to detect potential honeypots, rugs, and security vulnerabilities before you invest.
          </p>
        </div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 10, 50, 0.4), rgba(10, 5, 30, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 240, 136, 0.2)',
            borderRadius: '24px',
            padding: '2.5rem',
            marginBottom: '3rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 240, 136, 0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#00f088', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Token Contract Address
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Paste Solana token address (e.g. 7xKX...sAsU)"
                style={{
                  flex: 1,
                  minWidth: '300px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: "'Space Grotesk', monospace"
                }}
              />
              <button 
                onClick={scanContract}
                disabled={isScanning}
                style={{
                  padding: '0 2.5rem',
                  height: '3.6rem',
                  background: 'linear-gradient(135deg, #00f088 0%, #00d4ff 100%)',
                  color: '#050214',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isScanning ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 20px rgba(0, 240, 136, 0.2)',
                  textTransform: 'uppercase'
                }}
              >
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results and History Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: '1fr 350px', gap: '2rem' }}>
          {/* Main Results */}
          <div style={{ minHeight: '400px' }}>
            <AnimatePresence mode='wait'>
              {isScanning ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '24px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    padding: '4rem'
                  }}
                >
                  <div className="scan-loader" style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    border: '4px solid rgba(0, 240, 136, 0.1)',
                    borderTopColor: '#00f088',
                    animation: 'spin 1.5s linear infinite',
                    marginBottom: '2rem'
                  }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Agent Analyzing Contract...</h3>
                  <p style={{ opacity: 0.6 }}>Decrypting byte-code and tracing liquidity origins</p>
                </motion.div>
              ) : scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'rgba(20, 10, 50, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '2.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>{scanResult.tokenName}</h2>
                      <p style={{ opacity: 0.5, fontSize: '0.9rem', fontFamily: 'monospace' }}>{scanResult.address}</p>
                    </div>
                    <div style={{ 
                      padding: '1.5rem 2.5rem', 
                      background: getRiskBg(scanResult.riskLevel),
                      borderRadius: '16px',
                      border: `1px solid ${getRiskColor(scanResult.riskLevel)}`,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem', color: getRiskColor(scanResult.riskLevel) }}>Risk Score</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: getRiskColor(scanResult.riskLevel) }}>{scanResult.riskScore}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: getRiskColor(scanResult.riskLevel) }}>{scanResult.riskLevel} Risk</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Contract Status</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{scanResult.ownership} Ownership</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Liquidity Status</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: scanResult.lpLocked === 'Yes' ? '#00f088' : '#ff4757' }}>LP {scanResult.lpLocked === 'Yes' ? 'Locked' : 'Unlocked'}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Mintable</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: scanResult.mintable === 'Yes' ? '#ff4757' : '#00f088' }}>{scanResult.mintable}</div>
                    </div>
                  </div>

                  {scanResult.flags.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ff4757', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠</span> Critical Warning Flags
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {scanResult.flags.map((flag, idx) => (
                          <div key={idx} style={{ padding: '1rem 1.5rem', background: 'rgba(255, 71, 87, 0.05)', border: '1px solid rgba(255, 71, 87, 0.1)', borderRadius: '10px', color: '#ffb3b5', fontSize: '0.9rem' }}>
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href={scanResult.dexScreener} target="_blank" rel="noopener noreferrer" style={{ padding: '0.8rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.2s' }}>View on DexScreener</a>
                    <a href={scanResult.solscan} target="_blank" rel="noopener noreferrer" style={{ padding: '0.8rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.2s' }}>View on Solscan</a>
                  </div>
                </motion.div>
              ) : (
                <div style={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: '24px',
                  border: '1px dashed rgba(255, 255, 255, 0.05)',
                  padding: '4rem',
                  opacity: 0.5
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔍</div>
                  <h3 style={{ fontSize: '1.2rem' }}>No contract selected</h3>
                  <p style={{ fontSize: '0.9rem' }}>Enter a Solana contract address above to begin analysis</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* History Sidebar */}
          <div>
            <div style={{
              background: 'rgba(20, 10, 50, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '1.5rem',
              height: 'fit-content'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1rem' }}>Scan History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scanHistory.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: `4px solid ${getRiskColor(item.riskLevel)}`
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.tokenName}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: getRiskColor(item.riskLevel) }}>Score: {item.riskScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIRiskScanner;
