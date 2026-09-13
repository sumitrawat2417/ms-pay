import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@ms-pay/api-client';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getTransactions().then(res => res.data)
  });

  return (
    <div className="page pb-28">
      <header className="px-6 pt-12 pb-6 relative overflow-hidden">
        {/* Subtle decorative gradient background for header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-foreground">
            Transaction History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your spending and recharges
          </p>
        </div>
      </header>

      <div className="px-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-border/50 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-border/50 p-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <HistoryIcon size={24} />
            </div>
            <p className="text-foreground font-semibold text-lg">No transactions yet</p>
            <p className="text-muted-foreground text-sm mt-1">Your activity will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions?.map((tx) => {
              const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';
              return (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/history/${tx.id}`)}
                  className="bg-white border border-border/50 p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/30 shadow-sm group"
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
                    <p className="text-foreground font-semibold truncate text-[15px]">
                      {tx.merchantName || (tx.type === 'recharge_self' ? 'Added Money' : 'System')}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
                      <span>{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className={`text-right ${isCredit ? 'text-success' : 'text-foreground'}`}>
                    <p className="font-semibold text-[15px]">
                      {isCredit ? '+' : '-'} {tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] font-bold text-success/70 mt-1">
                      SUCCESS
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
