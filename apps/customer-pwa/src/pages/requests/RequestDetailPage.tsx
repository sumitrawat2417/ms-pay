import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPaymentRequests, approveRequest } from '@ms-pay/api-client';
import { ChevronLeft, Store, ShieldAlert, Check } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useBalance } from '@/hooks/useBalance';

const hashPasscode = (pass: string) => btoa(pass); 

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: balanceData } = useBalance();
  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => getPaymentRequests().then(res => res.data)
  });

  const request = requests?.find(r => r.id === id);
  const balance = balanceData?.wallet.balanceMsp || 0;
  const amount = request?.amountMsp || 0;
  const insufficientFunds = amount > balance;

  const handleApprove = async () => {
    if (!request || insufficientFunds || passcode.length < 6) return;
    if (!isOnline) {
      setError('You must be online to approve a request.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await approveRequest({
        requestId: request.id,
        passcodeHash: hashPasscode(passcode),
        idempotencyKey: `approve-${Date.now()}`
      });

      if (res.success) {
        setSuccess(true);
        // invalidate both requests and balance
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        queryClient.invalidateQueries({ queryKey: ['balance'] });
        
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 2000);
      } else {
        setError(res.error || 'Approval failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="page p-6 pt-24 text-center">Loading...</div>;
  
  if (!request) {
    return (
      <div className="page p-6 pt-24 text-center">
        <p className="text-danger mb-4">Request not found or already processed.</p>
        <button onClick={() => navigate('/requests')} className="btn-secondary">Back to Requests</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-success flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
          <Check size={40} className="text-success" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Request Approved</h1>
        <p className="opacity-90">Payment sent to {request.merchantName}</p>
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

      <div className="px-6 flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Store size={28} className="text-primary" />
        </div>
        <p className="text-muted-foreground text-sm font-medium mb-1">Request from</p>
        <h1 className="text-2xl font-bold text-foreground text-center">{request.merchantName}</h1>
      </div>

      <div className="px-6 mb-8">
        <div className="card text-center p-8 bg-card-elevated border-primary/20 shadow-lg">
          <p className="text-muted-foreground text-sm font-medium mb-2">Amount to Pay</p>
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-2xl font-semibold text-foreground/70">MSP</span>
            <span className="text-5xl font-bold text-foreground numeral">{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center text-left">
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className={`text-sm font-semibold numeral ${insufficientFunds ? 'text-danger' : 'text-foreground'}`}>
                {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} MSP
              </p>
            </div>
            {insufficientFunds && (
              <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded">Short</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 mt-auto">
        {error && <p className="text-danger text-sm text-center mb-4">{error}</p>}
        {!isOnline && (
          <div className="mb-4 p-4 bg-danger/10 text-danger rounded-2xl flex gap-3 items-start border border-danger/20">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium">You must be online to approve.</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">
            Confirm with Passcode
          </label>
          <input
            type="password"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
            className="input text-center text-2xl tracking-[1em]"
            placeholder="••••••"
            disabled={insufficientFunds || !isOnline}
          />
        </div>

        <button
          onClick={handleApprove}
          disabled={insufficientFunds || passcode.length < 6 || isSubmitting || !isOnline}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            'Approve Payment'
          )}
        </button>
      </div>
    </div>
  );
}
