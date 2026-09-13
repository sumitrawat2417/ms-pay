import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { submitMerchantAssistedPay } from '@ms-pay/api-client';
import { useAuthStore } from '@/store/authStore';

type Step = 'AMOUNT' | 'PASSCODE' | 'SUCCESS';

export default function ChargeConsumerPage() {
  const navigate = useNavigate();
  const { consumerToken } = useParams<{ consumerToken: string }>();
  const merchantName = useAuthStore((s) => s.merchantName);
  
  const [step, setStep] = useState<Step>('AMOUNT');
  const [amount, setAmount] = useState('0');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNumpad = (num: string) => {
    if (step === 'AMOUNT') {
      setAmount((prev) => {
        if (prev === '0') return num;
        if (prev.length >= 8) return prev;
        return prev + num;
      });
    } else if (step === 'PASSCODE') {
      setPasscode((prev) => {
        if (prev.length >= 4) return prev;
        return prev + num;
      });
    }
  };

  const handleBackspace = () => {
    if (step === 'AMOUNT') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (step === 'PASSCODE') {
      setPasscode((prev) => prev.slice(0, -1));
    }
  };

  const handleContinueAmount = () => {
    if (Number(amount) > 0) {
      setStep('PASSCODE');
    }
  };

  const handleSubmitPayment = async () => {
    if (passcode.length !== 4) return;
    
    setLoading(true);
    setError(null);
    try {
      // Make real API call to the new Mode A endpoint
      const res = await submitMerchantAssistedPay({
        consumerIdQrToken: consumerToken || '',
        consumerPasscode: passcode,
        amountMsp: Number(amount)
      });
      
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setError(res.error || 'Payment failed');
        setPasscode(''); // Reset passcode so they can try again
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setPasscode('');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // UI: Success Step
  // --------------------------------------------------------
  if (step === 'SUCCESS') {
    return (
      <div className="page bg-background flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold font-sora mb-2">Paid!</h1>
        <p className="text-muted-foreground font-inter mb-8 text-center">
          Successfully charged <br/>
          <span className="font-bold text-foreground text-lg">{amount} MSP</span>
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs bg-primary text-primary-foreground font-semibold py-4 rounded-xl active:scale-95 transition-transform font-inter"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // UI: Passcode Step (Consumer POV on Merchant Device)
  // --------------------------------------------------------
  if (step === 'PASSCODE') {
    return (
      <div className="page bg-background flex flex-col">
        <header className="px-6 pt-12 pb-4">
          <button onClick={() => { setStep('AMOUNT'); setPasscode(''); setError(null); }} className="p-2 -ml-2 rounded-full hover:bg-card">
            <ArrowLeft size={24} />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center px-6 mt-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold font-sora text-center mb-2">Enter PIN to Pay</h1>
          <p className="text-muted-foreground text-center font-inter mb-8">
            You are paying <span className="font-semibold text-foreground">{amount} MSP</span><br/>
            to {merchantName}
          </p>

          {/* PIN Dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  i < passcode.length ? 'bg-primary scale-125' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {error && <p className="text-destructive font-medium mb-4">{error}</p>}
        </div>

        {/* Numpad */}
        <div className="p-6 bg-card rounded-t-[32px] border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-3 gap-y-6 gap-x-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumpad(num.toString())}
                className="h-16 text-2xl font-sora font-semibold text-foreground rounded-2xl active:bg-muted/50 transition-colors"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleNumpad('0')}
              className="h-16 text-2xl font-sora font-semibold text-foreground rounded-2xl active:bg-muted/50 transition-colors"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 text-xl font-inter font-medium text-muted-foreground rounded-2xl active:bg-muted/50 transition-colors flex items-center justify-center"
            >
              ⌫
            </button>
          </div>
          <button
            onClick={handleSubmitPayment}
            disabled={passcode.length < 4 || loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Payment'}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // UI: Amount Step (Merchant POV)
  // --------------------------------------------------------
  return (
    <div className="page bg-background flex flex-col">
      <header className="px-6 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-card">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground font-medium font-inter mb-4">Enter Amount to Charge</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-sora font-semibold text-muted-foreground/50">MSP</span>
          <span className="text-6xl font-sora font-bold text-foreground tracking-tighter">
            {Number(amount).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="p-6 bg-card rounded-t-[32px] border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-y-6 gap-x-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumpad(num.toString())}
              className="h-16 text-2xl font-sora font-semibold text-foreground rounded-2xl active:bg-muted/50 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumpad('00')}
            className="h-16 text-xl font-sora font-semibold text-foreground rounded-2xl active:bg-muted/50 transition-colors"
          >
            00
          </button>
          <button
            onClick={() => handleNumpad('0')}
            className="h-16 text-2xl font-sora font-semibold text-foreground rounded-2xl active:bg-muted/50 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-16 text-xl font-inter font-medium text-muted-foreground rounded-2xl active:bg-muted/50 transition-colors flex items-center justify-center"
          >
            ⌫
          </button>
        </div>
        <button
          onClick={handleContinueAmount}
          disabled={Number(amount) <= 0}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
