import { NavLink } from 'react-router-dom';
import { Home, QrCode, Bell, History, User } from 'lucide-react';
import { usePendingRequestCount } from '@/hooks/useRequests';

const tabs = [
  { to: '/home',     icon: Home,    label: 'Home' },
  { to: '/pay/scan', icon: QrCode,  label: 'Scan' },
  { to: '/requests', icon: Bell,    label: 'Requests', badge: true },
  { to: '/history',  icon: History, label: 'History' },
  { to: '/profile',  icon: User,    label: 'Profile' },
];

export function BottomTabBar() {
  const pendingCount = usePendingRequestCount();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto"
      aria-label="Main navigation"
    >
      <div className="glass-card border-t border-border rounded-t-3xl px-2 pb-safe">
        <div className="flex justify-around pt-3 pb-2">
          {tabs.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              id={`tab-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    {badge && pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {label}
                  </span>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
