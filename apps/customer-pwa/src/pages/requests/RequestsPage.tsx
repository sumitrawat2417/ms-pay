import { useNavigate } from 'react-router-dom';
import { useRequests } from '@/hooks/useRequests';
import { Bell, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function RequestsPage() {
  const navigate = useNavigate();
  const { data: requests, isLoading, error } = useRequests();
  const isOnline = useOnlineStatus();

  return (
    <div className="page pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell size={24} className="text-primary" />
          Requests
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and approve payment requests.
        </p>
      </header>

      <div className="px-6">
        {!isOnline && (
          <div className="mb-6 p-4 bg-danger/10 text-danger rounded-2xl flex gap-3 items-start border border-danger/20">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              You're offline. You cannot approve requests until you reconnect to the internet.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-card rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-danger">Failed to load requests</div>
        ) : requests?.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <Bell size={28} className="text-muted-foreground opacity-50" />
            </div>
            <p className="text-foreground font-semibold">All caught up!</p>
            <p className="text-muted-foreground text-sm mt-1">You have no pending payment requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests?.map((req) => (
              <div
                key={req.id}
                onClick={() => navigate(`/requests/${req.id}`)}
                className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer shadow-sm hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-primary uppercase leading-tight">Pay</span>
                  <span className="text-xs font-semibold text-primary">{req.amountMsp}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{req.merchantName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Clock size={12} />
                    <span>{new Date(req.createdAt).toLocaleDateString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="text-sm">Review</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
