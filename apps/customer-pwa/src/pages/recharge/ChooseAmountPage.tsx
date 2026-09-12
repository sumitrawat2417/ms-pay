import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

export default function ChooseAmountPage() {
  const [amountStr, setAmountStr] = useState('');
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const handleNext = () => {
    const val = parseFloat(amountStr);
    if (val > 0) {
      navigate(`/recharge/method?amount=${val}`);
    }
  };

  return (
    <div className="page">
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-foreground mr-10">Add Money</h1>
      </header>

      <div className="px-6 flex-1 flex flex-col pt-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm font-medium mb-4">Enter amount to add</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-semibold text-foreground/70 pb-1">MSP</span>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0"
              className="bg-transparent text-6xl font-bold text-center text-foreground outline-none numeral placeholder:text-muted max-w-[200px]"
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmountStr(amt.toString())}
              className="bg-card border border-border rounded-xl py-3 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
            >
              +{amt}
            </button>
          ))}
        </div>

        <div className="mt-auto pb-6">
          {!isOnline && (
            <p className="text-danger text-sm text-center mb-4 bg-danger/10 p-3 rounded-xl font-medium">
              You must be online to add money.
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!parseFloat(amountStr) || !isOnline}
            className="btn-primary w-full"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
