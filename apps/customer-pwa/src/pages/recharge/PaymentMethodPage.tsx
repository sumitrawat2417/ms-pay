import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CreditCard, Building2, Smartphone } from 'lucide-react';

const METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, RuPay' },
  { id: 'upi', name: 'UPI', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, subtitle: 'All Indian banks supported' },
];

export default function PaymentMethodPage() {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const navigate = useNavigate();

  const [selected, setSelected] = useState(METHODS[0].id);

  const handleNext = () => {
    navigate(`/recharge/confirm?amount=${amount}&method=${selected}`);
  };

  return (
    <div className="page">
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-foreground mr-10">Payment Method</h1>
      </header>

      <div className="px-6 flex-1 flex flex-col">
        <div className="bg-primary/10 rounded-2xl p-4 mb-8 text-center border border-primary/20">
          <p className="text-sm text-primary font-medium mb-1">Amount to add</p>
          <p className="text-2xl font-bold text-primary numeral">MSP {parseFloat(amount).toLocaleString('en-IN')}</p>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Select Method</h2>
        
        <div className="space-y-3">
          {METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = selected === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelected(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{method.subtitle}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pb-6 pt-8">
          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
