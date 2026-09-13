import { Link, useNavigate } from 'react-router-dom';
import { QrCode, ArrowDownLeft, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

// Mock data until API is hooked up
const mockTransactions = [
  { id: '1', amount: 150.00, customerName: 'Alice Johnson', type: 'sale_consumer_initiated', time: '10:45 AM' },
  { id: '2', amount: 45.50, customerName: 'Bob Smith', type: 'sale_consumer_initiated', time: '09:20 AM' },
  { id: '3', amount: 320.00, customerName: 'Charlie Brown', type: 'sale_merchant_assisted', time: 'Yesterday' },
];

export default function MerchantHomePage() {
  const merchantName = useAuthStore((s) => s.merchantName) || 'Store Owner';
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(root.classList.contains('dark'));
  };

  return (
    <div className="page pb-28">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="w-12 h-12 rounded-full overflow-hidden border-2 border-border shadow-sm flex items-center justify-center bg-card text-foreground font-sora font-bold text-lg">
            {merchantName.charAt(0)}
          </Link>
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest font-inter mb-0.5">Store Dashboard</p>
            <h1 className="text-xl font-bold text-foreground font-sora truncate max-w-[200px]">
              {merchantName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-card shadow-sm border border-border flex items-center justify-center text-foreground transition-transform active:scale-95"
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* Hero Earnings Card */}
      <div className="px-6 mb-10">
        <div className="relative rounded-[32px] p-1 brand-gradient shadow-elevation-high overflow-hidden">
          {/* Dedicated dark panel for legibility constraint */}
          <div className="bg-[#111111] rounded-[28px] p-6 relative overflow-hidden">
            {/* Subtle brand glow inside the dark panel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-start">
              <p className="text-[#A3A3A3] text-sm font-medium mb-3 font-inter">Today's Collections (MSP)</p>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-sora font-bold text-white tracking-tight">
                  1,245.50
                </span>
                <span className="text-xl font-sora font-semibold text-white/70">MSP</span>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => navigate('/store-qr')}
                  className="flex-1 bg-white text-black font-semibold font-inter py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <QrCode size={18} /> Show QR
                </button>
                <button 
                  className="flex-1 bg-white/10 text-white font-semibold font-inter py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/10"
                >
                  <ArrowDownLeft size={18} /> Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 flex-1 flex flex-col">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground font-sora">Recent Payments</h2>
          <Link to="/history" className="text-primary text-sm font-semibold font-inter hover:underline mb-0.5">
            See All
          </Link>
        </div>

        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 bg-card p-4 rounded-3xl border border-border shadow-soft transition-all active:scale-[0.98] group"
            >
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors bg-success/10 text-success">
                <ArrowDownLeft size={20} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-sora font-semibold truncate text-sm">
                  {tx.customerName}
                </p>
                <p className="text-muted-foreground text-[11px] mt-1 font-medium font-inter truncate">
                  Received Payment
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <p className="font-sora font-semibold text-sm text-success">
                  + {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-muted-foreground text-[10px] mt-1 font-medium font-inter">
                  {tx.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
