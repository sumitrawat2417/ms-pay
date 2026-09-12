import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PaySuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const merchant = searchParams.get('merchant') || 'Merchant';
  const amountStr = searchParams.get('amount') || '0';
  const amount = parseFloat(amountStr);

  useEffect(() => {
    // Invalidate balance on success
    queryClient.invalidateQueries({ queryKey: ['balance'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-success flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl opacity-50 mix-blend-overlay animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl opacity-50 mix-blend-overlay animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-2xl scale-in-center">
          <Check size={48} className="text-success" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">Payment Successful</h1>
        <p className="text-success-50 text-lg font-medium text-center mb-8">Paid to {merchant}</p>

        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/30 shadow-lg text-center min-w-[280px]">
          <p className="text-white/80 text-sm font-medium mb-2">Amount Paid</p>
          <div className="flex items-baseline justify-center gap-1 text-white">
            <span className="text-2xl font-semibold">MSP</span>
            <span className="text-5xl font-bold numeral tracking-tight">
              {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/home', { replace: true })}
          className="bg-white text-success px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/90 transition-transform active:scale-95 shadow-xl"
        >
          Done <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
