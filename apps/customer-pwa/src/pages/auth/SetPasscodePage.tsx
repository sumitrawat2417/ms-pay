import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { setConsumerPasscode } from '@ms-pay/api-client';

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function SetPasscodePage() {
  const [code, setCode] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string[]>([]);
  const [step, setStep] = useState<'set' | 'confirm' | 'saving'>('set');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const current = step === 'set' ? code : confirm;
  const setter = step === 'set' ? setCode : setConfirm;

  const handleDigit = (d: string) => {
    setError('');
    if (d === '⌫') {
      setter((prev) => prev.slice(0, -1));
      return;
    }
    if (d === '') return;
    if (current.length >= 6) return;
    const next = [...current, d];
    setter(next);

    if (next.length === 6) {
      if (step === 'set') {
        setTimeout(() => setStep('confirm'), 300);
      } else {
        // confirm step
        if (next.join('') === code.join('')) {
          setStep('saving');
          setConsumerPasscode(btoa(code.join(''))).then(() => {
            navigate('/home', { replace: true });
          }).catch(() => {
            setError('Failed to save passcode. Try again.');
            setStep('confirm');
            setConfirm([]);
          });
        } else {
          setError('Passcodes don\'t match. Try again.');
          setConfirm([]);
        }
      }
    }
  };

  const dots = Array(6).fill(null);

  if (step === 'saving') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7B2FF7]/20 blur-[120px] pointer-events-none" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      {/* Header */}
      <div className="px-6 pt-20 pb-8 text-center relative z-10 animate-fade-in" key={step}>
        <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,93,143,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
          <Shield size={26} className="text-white relative z-10 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
          {step === 'set' ? 'Set your passcode' : 'Confirm passcode'}
        </h1>
        <p className="text-white/60 mt-3 text-[16px] leading-relaxed font-medium">
          {step === 'set'
            ? 'Choose a 6-digit passcode. Your passcode is never shared.'
            : 'Enter the same passcode again to confirm.'}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-5 mb-12 relative z-10">
        {dots.map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < current.length 
                ? 'bg-primary scale-110 shadow-[0_0_12px_rgba(255,93,143,0.8)]' 
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-danger text-sm font-medium text-center mb-4 animate-fade-in relative z-10">{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 px-8 mt-auto pb-16 relative z-10 animate-slide-up">
        {DIGITS.map((d, i) => (
          <button
            key={i}
            id={`passcode-key-${d || 'empty'}`}
            onClick={() => handleDigit(d)}
            disabled={d === ''}
            className={`h-[72px] rounded-3xl text-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center ${
              d === '' ? 'invisible' :
              d === '⌫' ? 'bg-transparent text-white/60 hover:text-white' :
              'bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-white/20 shadow-sm backdrop-blur-md'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
