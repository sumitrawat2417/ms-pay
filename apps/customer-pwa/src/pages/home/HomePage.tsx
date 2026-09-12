import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Plus, ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useBalance } from '@/hooks/useBalance';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const { data, isLoading } = useBalance();
  const userName = useAuthStore((s) => s.consumerName);
  const navigate = useNavigate();

  return (
    <div className="page pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
          <h1 className="text-xl font-bold text-foreground truncate max-w-[200px]">
            {userName}
          </h1>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
          <span className="text-sm font-semibold">{userName?.charAt(0)}</span>
        </Link>
      </header>

      {/* Balance Hero Card */}
      <div className="px-6 mb-8">
        <div className="relative rounded-[32px] p-1 brand-gradient overflow-hidden shadow-2xl">
          <div className="bg-surface-dark rounded-[28px] p-6 relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-white/80">MSP</span>
              {isLoading ? (
                <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
              ) : (
                <span className="text-5xl font-bold text-white numeral tracking-tight">
                  {data?.wallet.balanceMsp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Quick Actions inside Hero */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate('/recharge')}
                className="flex-1 bg-white/10 hover:bg-white/15 transition-colors rounded-2xl py-3 flex items-center justify-center gap-2"
              >
                <Plus size={18} className="text-white" />
                <span className="text-white font-medium text-sm">Add Money</span>
              </button>
              <button
                onClick={() => navigate('/my-qr')}
                className="flex-1 bg-white text-surface-dark hover:bg-white/90 transition-colors rounded-2xl py-3 flex items-center justify-center gap-2"
              >
                <QrCode size={18} />
                <span className="font-semibold text-sm">My QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <Link to="/history" className="text-primary text-sm font-semibold flex items-center gap-1">
            See all <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-card border border-border" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-card rounded mb-2" />
                  <div className="h-3 w-16 bg-card rounded" />
                </div>
                <div className="h-5 w-16 bg-card rounded" />
              </div>
            ))}
          </div>
        ) : data?.recentTransactions.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.recentTransactions.map((tx) => {
              const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';
              return (
                <Link
                  key={tx.id}
                  to={`/history/${tx.id}`}
                  className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl transition-colors hover:bg-card-elevated"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCredit ? 'bg-success/10' : 'bg-primary/10'}`}>
                    {isCredit ? (
                      <ArrowDownLeft size={20} className="text-success" />
                    ) : (
                      <ArrowUpRight size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold truncate">
                      {tx.merchantName || (tx.type === 'recharge_self' ? 'Added Money' : 'System')}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`text-right ${isCredit ? 'text-success' : 'text-foreground'}`}>
                    <p className="font-semibold numeral">
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
