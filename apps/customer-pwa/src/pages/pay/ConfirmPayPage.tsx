import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resolveMerchantQr, initiatePayment } from '@ms-pay/api-client';
import type { Merchant } from '@ms-pay/types';
import { ChevronLeft, Store } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useBalance } from '@/hooks/useBalance';

// Mock hashing for client-side passcode (in a real app, use Web Crypto API)
const hashPasscode = (pass: string) => btoa(pass); 

export default function ConfirmPayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  
  const [amountStr, setAmountStr] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isOnline = useOnlineStatus();
  const { data: balanceData } = useBalance();

  useEffect(() => {
    if (!token) {
      navigate('/home', { replace: true });
      return;
    }
    resolveMerchantQr(token)
      .then((res) => {
        if (res.success) setMerchant(res.data);
        else setError(res.error || 'Invalid QR code');
      })
      .finally(() => setLoadingMerchant(false));
  }, [token, navigate]);

  const amount = parseFloat(amountStr || '0');
  const balance = balanceData?.wallet.balanceMsp || 0;
  const insufficientFunds = amount > balance;

  const handlePay = async () => {
    if (!merchant || amount <= 0 || insufficientFunds || passcode.length < 6) return;
    if (!isOnline) {
      setError('You must be online to make a payment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await initiatePayment({
        merchantStoreQrToken: token!,
        amountMsp: amount,
        passcodeHash: hashPasscode(passcode),
        idempotencyKey: `pay-${Date.now()}`
      });

      if (res.success) {
        navigate(`/pay/success?txId=${res.data.id}&merchant=${encodeURIComponent(res.data.merchantName!)}&amount=${amount}`, { replace: true });
      } else {
        setError(res.error || 'Payment failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingMerchant) {
    return <div className="page flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  if (error && !merchant) {
    return <div className="page p-6 pt-24 text-center">
      <p className="text-danger mb-6">{error}</p>
      <button onClick={() => navigate('/home')} className="btn-secondary">Go Home</button>
    </div>;
  }

  return (
    <div className="page pb-6">
      {/* Header */}
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
      </header>

      {/* Merchant Info */}
      <div className="px-6 flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
          <Store size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center">{merchant?.name}</h1>
        {merchant?.category && (
          <p className="text-muted-foreground text-sm mt-1">{merchant.category}</p>
        )}
      </div>

      {/* Amount Input */}
      <div className="px-6 mb-8">
        <div className="card text-center p-6 bg-card-elevated">
          <p className="text-muted-foreground text-sm font-medium mb-4">Enter Amount (MSP)</p>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-5xl font-bold text-center text-foreground outline-none numeral placeholder:text-muted"
              autoFocus
            />
          </div>
          <div className="mt-6 p-3 rounded-xl bg-background/50 border border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available Balance</span>
            <span className={`text-sm font-semibold numeral ${insufficientFunds ? 'text-danger' : 'text-foreground'}`}>
              {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {insufficientFunds && (
            <p className="text-danger text-xs text-center mt-3 animate-fade-in">Insufficient balance</p>
          )}
        </div>
      </div>

      {/* Passcode & Submit */}
      <div className="px-6 mt-auto">
        {error && <p className="text-danger text-sm text-center mb-4">{error}</p>}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">
            Enter 6-digit Passcode to confirm
          </label>
          <input
            type="password"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
            className="input text-center text-2xl tracking-[1em]"
            placeholder="••••••"
          />
        </div>

        {!isOnline ? (
          <div className="bg-danger/10 text-danger p-4 rounded-2xl text-center text-sm font-semibold border border-danger/20">
            You must be online to make a payment.
          </div>
        ) : (
          <button
            onClick={handlePay}
            disabled={amount <= 0 || insufficientFunds || passcode.length < 6 || isSubmitting}
            className="btn-primary flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              `Pay ${amount > 0 ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}`
            )}
          </button>
        )}
      </div>
    </div>
  );
}
