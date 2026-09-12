import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function SetPasscodePage() {
  const [code, setCode] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string[]>([]);
  const [step, setStep] = useState<'set' | 'confirm'>('set');
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
          // Passcode matches — navigate home
          navigate('/home', { replace: true });
        } else {
          setError('Passcodes don\'t match. Try again.');
          setConfirm([]);
        }
      }
    }
  };

  const dots = Array(6).fill(null);

  return (
    <div className="page">
      {/* Header */}
      <div className="px-6 pt-14 pb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Shield size={22} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {step === 'set' ? 'Set your passcode' : 'Confirm passcode'}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {step === 'set'
            ? 'Choose a 6-digit passcode. Your passcode is never shared.'
            : 'Enter the same passcode again to confirm.'}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-4 mb-8">
        {dots.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < current.length ? 'bg-primary scale-110' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-danger text-sm text-center mb-4 animate-fade-in">{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 px-8 mt-4">
        {DIGITS.map((d, i) => (
          <button
            key={i}
            id={`passcode-key-${d || 'empty'}`}
            onClick={() => handleDigit(d)}
            disabled={d === ''}
            className={`h-16 rounded-2xl text-xl font-semibold transition-all duration-150 active:scale-95 ${
              d === '' ? 'invisible' :
              d === '⌫' ? 'bg-transparent text-muted-foreground' :
              'bg-card border border-border text-foreground hover:bg-card-elevated'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
