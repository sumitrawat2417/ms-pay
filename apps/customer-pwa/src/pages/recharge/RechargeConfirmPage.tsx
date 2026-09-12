import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { selfRecharge } from '@ms-pay/api-client';
import { ChevronLeft, Check, ShieldAlert } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function RechargeConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  
  const amount = parseFloat(searchParams.get('amount') || '0');
  const method = searchParams.get('method') || 'card';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRecharge = async () => {
    if (amount <= 0) return;
    if (!isOnline) {
      setError('You must be online to recharge.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In real life, this would redirect to Razorpay/Stripe, then on success callback call our backend.
      // Here we just simulate the flow.
      await new Promise((r) => setTimeout(r, 1500)); // Simulate gateway delay
      
      const res = await selfRecharge({
        amountMsp: amount,
        paymentMethod: method as 'card' | 'upi' | 'bank',
        idempotencyKey: `pg-${Date.now()}`
      });
      if (res.success) {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ['balance'] });
        queryClient.invalidateQueries({ queryKey: ['history'] });
        setTimeout(() => navigate('/home', { replace: true }), 2500);
      } else {
        setError(res.error || 'Recharge failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-success flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
          <Check size={40} className="text-success" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Recharge Successful</h1>
        <p className="opacity-90">Added {amount.toLocaleString('en-IN')} MSP to your wallet</p>
      </div>
    );
  }

  return (
    <div className="page pb-6">
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="px-6 flex flex-col items-center flex-1">
        <h1 className="text-2xl font-bold text-foreground text-center mb-8">Confirm Recharge</h1>
        
        <div className="w-full bg-card border border-border rounded-[24px] p-6 shadow-sm mb-auto">
          <div className="text-center mb-6 pb-6 border-b border-border border-dashed">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total to Pay</p>
            <div className="text-4xl font-bold text-foreground numeral">
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              (Will be converted to {amount.toLocaleString('en-IN')} MSP)
            </p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-semibold text-foreground uppercase">{method.replace('netbanking', 'Net Banking')}</span>
          </div>
        </div>

        <div className="w-full">
          {error && <p className="text-danger text-sm text-center mb-4">{error}</p>}
          {!isOnline && (
            <div className="mb-4 p-4 bg-danger/10 text-danger rounded-2xl flex gap-3 items-start border border-danger/20">
              <ShieldAlert size={20} className="shrink-0 mt-0.5" />
              <p className="text-xs font-medium">Internet connection required.</p>
            </div>
          )}
          <button
            onClick={handleRecharge}
            disabled={loading || !isOnline}
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Pay Securely'
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by MS Pay Gateway
          </p>
        </div>
      </div>
    </div>
  );
}
