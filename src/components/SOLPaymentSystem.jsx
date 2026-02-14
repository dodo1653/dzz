import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const SOLPaymentSystem = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [transactionSignature, setTransactionSignature] = useState(null);
  const [countdown, setCountdown] = useState(30); // 30-second countdown for payment

  // Mock subscription plans
  const plans = {
    starter: {
      name: 'Starter',
      price: 0.05,
      features: [
        'Basic Twitter tracking',
        'Limited pump.fun monitoring',
        '5 tracked accounts',
        'Basic analytics',
        'Email support'
      ],
      color: 'linear-gradient(135deg, #7b5cf6, #9b7cf6)'
    },
    pro: {
      name: 'Pro',
      price: 0.1,
      features: [
        'Advanced Twitter tracking',
        'Full pump.fun monitoring',
        'Unlimited tracked accounts',
        'Advanced analytics',
        'AI risk scanning',
        'Priority support',
        'Early access to new features'
      ],
      color: 'linear-gradient(135deg, #00d4ff, #4de8ff)',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: 0.25,
      features: [
        'All Pro features',
        'Custom AI models',
        'Dedicated support',
        'Custom integrations',
        'API access',
        'White-label options'
      ],
      color: 'linear-gradient(135deg, #7dd3fc, #a5e4ff)'
    }
  };

  // Mock Solana wallet address for receiving payments
  const paymentAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';

  // Countdown timer for payment
  useEffect(() => {
    let timer;
    if (paymentStatus === 'processing' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && paymentStatus === 'processing') {
      setPaymentStatus('error');
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [countdown, paymentStatus]);

  const initiatePayment = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setPaymentStatus('processing');
    setCountdown(30);

    try {
      // In a real implementation, this would create and send a Solana transaction
      // For this demo, we'll simulate the transaction
      
      // Simulate transaction processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful transaction
      const mockSignature = '4fdhG8djf9d83jd9f8dj398dj398dj398dj398dj398dj398dj398dj398dj398dj3';
      setTransactionSignature(mockSignature);
      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setTransactionSignature(null);
    setCountdown(30);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a051e 0%, #050214 100%)',
      color: 'white',
      paddingTop: '6rem',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Cyberpunk grid background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '0, 212, 255' : '123, 92, 246'}, 0.${Math.floor(Math.random() * 3) + 1}) 0%, transparent 70%)`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(20px)',
              opacity: 0.3,
              animation: `float${i % 3} ${15 + i * 5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float0 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(20px, 20px) rotate(5deg); }
        }
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-20px, -15px) rotate(-5deg); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(15px, -20px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.4); }
        }
        @keyframes paymentPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(0, 212, 255, 0); }
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', 'Archivo', sans-serif",
              fontSize: 'clamp(2.7rem, 6vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: '1.05',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #fff 0%, #b0f0ff 30%, #00d4ff 60%, #7b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 10px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.15)',
          }}>
            Subscribe with SOL
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              fontSize: '1.1rem',
              color: '#d0f0ff',
              fontFamily: "'Inter', 'Sora', sans-serif",
              fontWeight: 400,
              letterSpacing: '0.015em',
              lineHeight: '1.7',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}>
            Pay directly with Solana (SOL) to unlock premium features and support the platform
          </motion.p>
        </div>

        {/* Payment Status Banner */}
        {paymentStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: paymentStatus === 'success' 
                ? 'linear-gradient(135deg, rgba(0, 20, 10, 0.85), rgba(0, 10, 5, 0.95))' 
                : paymentStatus === 'processing'
                ? 'linear-gradient(135deg, rgba(10, 20, 30, 0.85), rgba(5, 10, 20, 0.95))'
                : 'linear-gradient(135deg, rgba(20, 0, 10, 0.85), rgba(10, 0, 5, 0.95))',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: paymentStatus === 'success' 
                ? '1px solid rgba(0, 240, 136, 0.15)' 
                : paymentStatus === 'processing'
                ? '1px solid rgba(0, 212, 255, 0.15)'
                : '1px solid rgba(255, 71, 87, 0.15)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: paymentStatus === 'success' 
                ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,240,136,0.1), 0 0 60px rgba(0,240,136,0.05)'
                : paymentStatus === 'processing'
                ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,212,255,0.1), 0 0 60px rgba(0,212,255,0.05)'
                : '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,71,87,0.1), 0 0 60px rgba(255,71,87,0.05)',
            }}
          >
            {paymentStatus === 'processing' ? (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0, 212, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'paymentPulse 2s infinite',
                }}>
                  <svg width="24" height="24" fill="none" stroke="#00d4ff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#00d4ff',
                    fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                    marginBottom: '0.25rem',
                  }}>
                    Processing Payment...
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora', 'Inter', sans-serif",
                  }}>
                    Please confirm the transaction in your wallet. Time remaining: {countdown}s
                  </div>
                </div>
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 136, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" fill="#00f088" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#00f088',
                    fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                    marginBottom: '0.25rem',
                  }}>
                    Payment Successful!
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora', 'Inter', sans-serif",
                  }}>
                    Transaction: {transactionSignature?.substring(0, 8)}...{transactionSignature?.substring(transactionSignature.length - 8)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 71, 87, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" fill="#ff4757" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#ff4757',
                    fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                    marginBottom: '0.25rem',
                  }}>
                    Payment Failed
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora', 'Inter', sans-serif",
                  }}>
                    Please try again or contact support
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Subscription Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {Object.entries(plans).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * Object.keys(plans).indexOf(key) }}
              whileHover={{ y: -10 }}
              style={{
                background: selectedPlan === key
                  ? 'linear-gradient(135deg, rgba(10, 5, 30, 0.85), rgba(5, 2, 20, 0.95))'
                  : 'linear-gradient(135deg, rgba(15, 8, 35, 0.6), rgba(8, 4, 25, 0.8))',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: selectedPlan === key
                  ? `1px solid ${plan.color.replace('linear-gradient(135deg, ', '').replace(')', '').split(',')[0]}40`
                  : '1px solid rgba(123, 92, 246, 0.15)',
                borderRadius: '24px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setSelectedPlan(key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  background: 'linear-gradient(135deg, #ff6b00, #ff8e00)',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  fontFamily: "'Sora', 'Inter', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 15px rgba(255,107,0,0.4)',
                }}>
                  Popular
                </div>
              )}
              
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#f0f4ff',
                  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
                  marginBottom: '0.5rem',
                }}>
                  {plan.name}
                </h3>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  background: plan.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Archivo', 'Inter', sans-serif",
                  marginBottom: '0.25rem',
                }}>
                  {plan.price} SOL
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: "'Sora', 'Inter', sans-serif",
                }}>
                  per month
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: '2rem',
              }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    color: '#e0e7ff',
                    fontFamily: "'Sora', 'Inter', sans-serif",
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: plan.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={initiatePayment}
                disabled={paymentStatus === 'processing'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: plan.color,
                  color: 'white',
                  fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: paymentStatus === 'processing' ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (paymentStatus !== 'processing') {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = `0 8px 24px ${plan.color.replace('linear-gradient(135deg, ', '').replace(')', '').split(',')[0]}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {paymentStatus === 'processing' ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Processing...
                  </div>
                ) : (
                  selectedPlan === key ? 'Subscribe Now' : 'Select Plan'
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(10, 5, 30, 0.85), rgba(5, 2, 20, 0.95))',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(123, 92, 246, 0.15)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(123,92,246,0.1), 0 0 60px rgba(123,92,246,0.05)',
          }}
        >
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            fontFamily: "'Space Grotesk', 'Sora', sans-serif",
            marginBottom: '1.5rem',
            position: 'relative',
          }}>
            Secure Payment Information
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, #7b5cf6, #00d4ff)',
              borderRadius: '1px',
            }} />
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#f0f4ff',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                marginBottom: '1rem',
              }}>
                Payment Address
              </h3>
              <div style={{
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontSize: '0.9rem',
                wordBreak: 'break-all',
                border: '1px solid rgba(123, 92, 246, 0.2)',
              }}>
                {paymentAddress}
              </div>
            </div>

            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#f0f4ff',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                marginBottom: '1rem',
              }}>
                Security Features
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: '#e0e7ff',
                  fontFamily: "'Sora', 'Inter', sans-serif",
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="#00f088" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  End-to-end encryption
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: '#e0e7ff',
                  fontFamily: "'Sora', 'Inter', sans-serif",
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="#00f088" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  Blockchain verification
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#e0e7ff',
                  fontFamily: "'Sora', 'Inter', sans-serif",
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="#00f088" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  Instant confirmation
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#f0f4ff',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                marginBottom: '1rem',
              }}>
                Need Help?
              </h3>
              <p style={{
                color: '#e0e7ff',
                fontFamily: "'Sora', 'Inter', sans-serif",
                lineHeight: '1.6',
                marginBottom: '1rem',
              }}>
                Having trouble with your payment? Our support team is here to help you 24/7.
              </p>
              <button
                onClick={() => alert('Opening support chat...')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success/Failure Actions */}
        {(paymentStatus === 'success' || paymentStatus === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={resetPayment}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #7b5cf6, #00d4ff)',
                color: 'white',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(123, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {paymentStatus === 'success' ? 'Subscribe Another' : 'Try Again'}
            </button>

            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SOLPaymentSystem;