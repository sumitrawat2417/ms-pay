import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@ms-pay/api-client';
import { ChevronLeft, Receipt, Store, Hash, Calendar, CheckCircle } from 'lucide-react';

export default function TxDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getTransactions().then(res => res.data)
  });

  const tx = transactions?.find((t) => t.id === id);

  if (isLoading) return <div className="page p-6 pt-24 text-center">Loading...</div>;

  if (!tx) {
    return (
      <div className="page p-6 pt-24 text-center">
        <p className="text-danger mb-4">Transaction not found.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  const isCredit = tx.type.startsWith('recharge') || tx.type === 'refund';

  return (
    <div className="page pb-12">
      <header className="px-4 pt-12 pb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-card rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-foreground mr-10">Details</h1>
      </header>

      <div className="px-6 flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isCredit ? 'bg-success/10' : 'bg-primary/10'}`}>
          {isCredit ? (
            <Store size={32} className="text-success" />
          ) : (
            <Store size={32} className="text-primary" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-foreground text-center">
          {tx.merchantName || (tx.type === 'recharge_self' ? 'Added Money' : 'System')}
        </h2>
        
        <div className="flex items-center gap-2 mt-4 mb-8">
          <CheckCircle size={16} className="text-success" />
          <span className="text-success font-semibold text-sm uppercase">COMPLETED</span>
        </div>

        <div className="w-full bg-card border border-border rounded-[24px] p-6 shadow-sm">
          <div className="text-center mb-6 pb-6 border-b border-border border-dashed">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Amount</p>
            <div className={`text-4xl font-bold numeral ${isCredit ? 'text-success' : 'text-foreground'}`}>
              {isCredit ? '+' : '-'}{tx.amountMsp.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-xl">MSP</span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span>Date & Time</span>
              </div>
              <span className="font-semibold text-foreground">
                {new Date(tx.createdAt).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt size={16} />
                <span>Type</span>
              </div>
              <span className="font-semibold text-foreground capitalize">
                {tx.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash size={16} />
                <span>Transaction ID</span>
              </div>
              <span className="font-semibold text-foreground font-mono text-xs max-w-[120px] truncate" title={tx.id}>
                {tx.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
