import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PasscodeResetPage() {
  const [code, setCode] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleDigit = (d: string) => {
    if (d === '⌫') {
      setCode((prev) => prev.slice(0, -1));
      return;
    }
    if (d === '') return;
    if (code.length >= 6) return;
    const next = [...code, d];
    setCode(next);

    if (next.length === 6) {
      setTimeout(() => {
        alert('Passcode changed successfully (Simulated)');
        navigate('/profile', { replace: true });
      }, 500);
    }
  };

  const dots = Array(6).fill(null);

  return (
    <div className="page">
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="px-6 pt-4 pb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Shield size={22} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Enter New Passcode</h1>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {dots.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < code.length ? 'bg-primary scale-110' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 px-8 mt-4">
        {DIGITS.map((d, i) => (
          <button
            key={i}
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
