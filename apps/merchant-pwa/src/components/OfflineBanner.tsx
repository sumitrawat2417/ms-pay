import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="bg-danger/90 text-white px-4 py-3 flex items-center gap-3 animate-slide-up z-50"
      role="alert"
      aria-live="assertive"
    >
      <WifiOff size={16} className="flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold">You're offline</p>
        <p className="text-xs opacity-80">Payments and recharge require an internet connection.</p>
      </div>
    </div>
  );
}
