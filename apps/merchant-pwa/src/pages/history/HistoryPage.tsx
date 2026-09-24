import { useMerchantDashboard } from '@/hooks/useMerchantDashboard';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function HistoryPage() {
  const { data, isLoading } = useMerchantDashboard();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold font-sora">Transaction History</h1>
      </div>

      <div className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
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
        ) : !data?.recentTransactions?.length ? (
          <div className="text-center py-10 bg-card rounded-3xl border border-border mt-10">
            <p className="text-muted-foreground text-sm font-inter">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 bg-card p-4 rounded-3xl border border-border shadow-soft transition-all active:scale-[0.98] group"
              >
                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors ${
                  tx.amountMsp > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {tx.amountMsp > 0 ? <ArrowDownLeft size={20} strokeWidth={2.5} /> : <ArrowUpRight size={20} strokeWidth={2.5} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-sora font-semibold truncate text-sm">
                    {tx.type === 'sale_consumer_initiated' ? 'Customer Scan' : tx.type === 'sale_merchant_assisted' ? 'Merchant Scan' : 'Payment'}
                  </p>
                  <p className="text-muted-foreground text-[11px] mt-1 font-medium font-inter truncate">
                    {tx.amountMsp > 0 ? 'Received' : 'Sent'}
                  </p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <p className={`font-sora font-semibold text-sm ${tx.amountMsp > 0 ? 'text-success' : 'text-danger'}`}>
                    {tx.amountMsp > 0 ? '+' : ''} {tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-muted-foreground text-[10px] mt-1 font-medium font-inter">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
