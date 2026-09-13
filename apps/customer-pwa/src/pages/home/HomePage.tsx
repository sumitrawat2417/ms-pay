import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Plus, ArrowDownLeft, ArrowUpRight, Grid, Moon, Sun, ArrowRightLeft } from 'lucide-react';
import { useBalance } from '@/hooks/useBalance';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { data, isLoading } = useBalance();
  const userName = useAuthStore((s) => s.consumerName);
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
            {userName?.charAt(0)}
          </Link>
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest font-inter mb-0.5">Welcome</p>
            <h1 className="text-xl font-bold text-foreground font-sora truncate max-w-[200px]">
              {userName}
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
          <button className="w-10 h-10 rounded-full bg-card shadow-sm border border-border flex items-center justify-center text-foreground transition-transform active:scale-95">
            <QrCode size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Hero Balance Card */}
      <div className="px-6 mb-10">
        <div className="relative rounded-[32px] p-1 brand-gradient shadow-elevation-high overflow-hidden">
          {/* Dedicated dark panel for legibility constraint */}
          <div className="bg-[#111111] rounded-[28px] p-6 relative overflow-hidden">
            {/* Subtle brand glow inside the dark panel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-start">
              <p className="text-[#A3A3A3] text-sm font-medium mb-3 font-inter">Total Balance in MSP</p>
              
              <div className="flex items-baseline gap-2 mb-4">
                {isLoading ? (
                  <div className="h-12 w-48 bg-white/10 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-5xl font-sora font-bold text-white tracking-tight">
                      {data?.wallet.balanceMsp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xl font-sora font-semibold text-white/70">MSP</span>
                  </>
                )}
              </div>

              {/* Trend Pill */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                <ArrowUpRight size={14} className="text-[#FF8A3D]" strokeWidth={2.5} />
                <span className="text-white/90 text-xs font-semibold font-inter tracking-wide">+2.5% this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between px-8 mb-12">
        <button onClick={() => navigate('/recharge')} className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-[20px] bg-card shadow-soft border border-border flex items-center justify-center text-foreground group-active:scale-95 transition-all">
            <Plus size={22} strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold text-foreground font-inter">Add</span>
        </button>
        
        <button onClick={() => navigate('/pay/scan')} className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-[20px] bg-card shadow-soft border border-border flex items-center justify-center text-foreground group-active:scale-95 transition-all">
            <ArrowUpRight size={22} strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold text-foreground font-inter">Send</span>
        </button>
        
        <button onClick={() => navigate('/my-qr')} className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-[20px] bg-card shadow-soft border border-border flex items-center justify-center text-foreground group-active:scale-95 transition-all">
            <ArrowDownLeft size={22} strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold text-foreground font-inter">Receive</span>
        </button>
        
        <button className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-[20px] bg-card shadow-soft border border-border flex items-center justify-center text-foreground group-active:scale-95 transition-all">
            <Grid size={22} strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold text-foreground font-inter">More</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="px-6 flex-1 flex flex-col">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground font-sora">Recent Activity</h2>
          <Link to="/history" className="text-primary text-sm font-semibold font-inter hover:underline mb-0.5">
            See All
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 bg-card p-4 rounded-3xl border border-border animate-pulse">
                <div className="w-12 h-12 rounded-[18px] bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted rounded mb-2" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : data?.recentTransactions.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-3xl border border-border">
            <p className="text-muted-foreground text-sm font-inter">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.recentTransactions.map((tx) => {
              const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';
              const isPayment = tx.type.startsWith('sale_');
              
              // Mock funding source subtext based on transaction type for Quantra spec
              let fundingSource = '';
              if (tx.type.startsWith('recharge')) fundingSource = 'Deposited via Default Bank';
              else if (isPayment) fundingSource = 'Paid via MSP Wallet';
              else if (tx.type === 'refund') fundingSource = 'Refund from Merchant';
              else fundingSource = 'System transaction';

              return (
                <Link
                  key={tx.id}
                  to={`/history/${tx.id}`}
                  className="flex items-center gap-4 bg-card p-4 rounded-3xl border border-border shadow-soft transition-all active:scale-[0.98] group"
                >
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors ${
                    isCredit ? 'bg-success/10 text-success' : 
                    isPayment ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-foreground'
                  }`}>
                    {isCredit ? (
                      <ArrowDownLeft size={20} strokeWidth={2.5} />
                    ) : isPayment ? (
                      <ArrowRightLeft size={20} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-sora font-semibold truncate text-sm">
                      {tx.merchantName || (tx.type.startsWith('recharge') ? 'Wallet Top-up' : 'System')}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1 font-medium font-inter truncate">
                      {fundingSource}
                    </p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-sora font-semibold text-sm ${isCredit ? 'text-success' : 'text-foreground'}`}>
                      {isCredit ? '+' : '-'} {tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-muted-foreground text-[10px] mt-1 font-medium font-inter">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
