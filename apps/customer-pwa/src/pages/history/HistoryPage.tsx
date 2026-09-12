import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@ms-pay/api-client';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getTransactions().then(res => res.data)
  });

  return (
    <div className="page pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <HistoryIcon size={24} className="text-primary" />
          History
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your recent transactions and recharges.
        </p>
      </header>

      <div className="px-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-card rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions?.map((tx) => {
              const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';
              return (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/history/${tx.id}`)}
                  className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all hover:bg-card-elevated shadow-sm"
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
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar size={12} />
                      <span>{new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className={`text-right ${isCredit ? 'text-success' : 'text-foreground'}`}>
                    <p className="font-semibold numeral">
                      {isCredit ? '+' : '-'} {tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                      COMPLETED
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
