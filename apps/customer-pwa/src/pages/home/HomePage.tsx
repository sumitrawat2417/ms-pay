import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Plus, ArrowDownLeft, ArrowUpRight, Grid } from 'lucide-react';
import { useBalance } from '@/hooks/useBalance';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const { data, isLoading } = useBalance();
  const userName = useAuthStore((s) => s.consumerName);
  const navigate = useNavigate();

  return (
    <div className="page pb-28">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-primary text-white font-bold text-lg">
            {userName?.charAt(0)}
          </Link>
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Welcome Back</p>
            <h1 className="text-xl font-bold text-foreground truncate max-w-[200px]">
              {userName}
            </h1>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-foreground">
          <QrCode size={20} />
        </button>
      </header>

      {/* Balance Hero Card */}
      <div className="px-6 mb-8">
        <div className="relative rounded-[32px] p-8 brand-gradient shadow-glow overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5" />
          
          <div className="relative z-10 text-center">
            <p className="text-white/80 text-sm font-medium mb-2">Total Balance in MSP</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-medium text-white/90 self-start mt-2">MSP</span>
              {isLoading ? (
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse" />
              ) : (
                <span className="text-5xl font-bold text-white tracking-tight">
                  {data?.wallet.balanceMsp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            {/* Mock percentage increase */}
            <div className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <ArrowUpRight size={14} className="text-white" />
              <span className="text-white text-xs font-medium">+2.5% this week</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (Overlapping or just below) */}
        <div className="flex justify-between px-2 mt-8">
          <button onClick={() => navigate('/recharge')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-xs font-medium text-foreground">Add</span>
          </button>
          
          <button onClick={() => navigate('/pay/scan')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-xs font-medium text-foreground">Send</span>
          </button>
          
          <button onClick={() => navigate('/my-qr')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <ArrowDownLeft size={24} />
            </div>
            <span className="text-xs font-medium text-foreground">Receive</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform">
              <Grid size={24} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">More</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 flex-1 bg-white rounded-t-[40px] pt-8 shadow-sm pb-10 border border-border/50">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-lg font-bold text-foreground">Transactions</h2>
          <Link to="/history" className="text-primary text-sm font-medium hover:underline">
            See All
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : data?.recentTransactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4 px-2">
            {data?.recentTransactions.map((tx) => {
              const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';
              return (
                <Link
                  key={tx.id}
                  to={`/history/${tx.id}`}
                  className="flex items-center gap-4 bg-white p-3 rounded-2xl transition-colors hover:bg-muted/50 group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isCredit ? 'bg-success/10 text-success group-hover:bg-success/20' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  }`}>
                    {isCredit ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold truncate text-sm">
                      {tx.merchantName || (tx.type === 'recharge_self' ? 'Wallet Top-up' : 'System')}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1 font-medium">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${isCredit ? 'text-success' : 'text-foreground'}`}>
                      {isCredit ? '+' : '-'} {tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
