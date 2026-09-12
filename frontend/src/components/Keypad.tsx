import React, { useState } from 'react';
import { LucideIcon, Delete } from 'lucide-react';

interface KeypadProps {
  onPinComplete: (pin: string) => void;
  pinLength?: number;
}

const Keypad: React.FC<KeypadProps> = ({ onPinComplete, pinLength = 4 }) => {
  const [pin, setPin] = useState<string>('');
  
  const handleKeyPress = (num: string) => {
    if (pin.length < pinLength) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === pinLength) {
        setTimeout(() => {
          onPinComplete(newPin);
          setPin('');
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="keypad-container glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '350px', margin: '0 auto' }}>
      
      {/* PIN Display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {Array.from({ length: pinLength }).map((_, i) => (
          <div 
            key={i} 
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: i < pin.length ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
              boxShadow: i < pin.length ? 'var(--shadow-glow)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>

      {/* Number Pad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button 
            key={num} 
            onClick={() => handleKeyPress(num.toString())}
            className="btn btn-ghost"
            style={{ width: '100%', aspectRatio: '1/1', fontSize: '1.5rem', borderRadius: '50%' }}
          >
            {num}
          </button>
        ))}
        
        <div /> {/* Empty space */}
        <button 
          onClick={() => handleKeyPress('0')}
          className="btn btn-ghost"
          style={{ width: '100%', aspectRatio: '1/1', fontSize: '1.5rem', borderRadius: '50%' }}
        >
          0
        </button>
        
        <button 
          onClick={handleDelete}
          className="btn btn-ghost"
          style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
        >
          <Delete size={24} />
        </button>
      </div>
    </div>
  );
};

export default Keypad;
