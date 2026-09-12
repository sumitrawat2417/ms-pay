import React, { useState } from 'react';
import Keypad from '../components/Keypad';
import { ScanLine, WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

const MerchantPOS: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [step, setStep] = useState<'scan' | 'amount' | 'pin' | 'success'>('scan');
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');

  const handleScan = () => {
    // Simulate scanning a QR code
    setWalletId('MS-USER-9382');
    setStep('amount');
  };

  const handlePinComplete = (pin: string) => {
    console.log("PIN entered (masked):", pin.replace(/./g, '*'));
    setStep('success');
  };

  const resetPos = () => {
    setWalletId('');
    setAmount('');
    setStep('scan');
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient">MS Pay POS</h2>
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.5rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: isOnline ? 'var(--success)' : 'var(--warning)',
            borderColor: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'
          }}
          onClick={() => setIsOnline(!isOnline)} // Toggle for testing
        >
          {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {isOnline ? 'Online Mode' : 'Offline Mode Active'}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        {step === 'scan' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem' }}>
            <ScanLine size={64} style={{ color: 'var(--primary-color)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Scan Customer QR</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Ask the customer to present their MS Pay static QR code.
            </p>
            <button className="btn btn-primary" onClick={handleScan}>
              Simulate Scan
            </button>
          </div>
        )}

        {step === 'amount' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Enter Amount</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Paying to: <strong style={{ color: 'var(--text-main)' }}>{walletId}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field" 
                style={{ fontSize: '2rem', textAlign: 'center', maxWidth: '200px' }}
                placeholder="0.00"
                autoFocus
              />
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', maxWidth: '200px' }}
              onClick={() => setStep('pin')}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue
            </button>
          </div>
        )}

        {step === 'pin' && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '0.5rem' }}>Authorize Payment</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Customer, please enter your 4-digit PIN to authorize ₹{amount}.
            </p>
            <Keypad onPinComplete={handlePinComplete} pinLength={4} />
          </div>
        )}

        {step === 'success' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Transaction Successful</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              ₹{amount} has been deducted from {walletId}. 
              {!isOnline && " (Queued for Sync)"}
            </p>
            <button className="btn btn-primary" onClick={resetPos}>
              New Transaction
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default MerchantPOS;
