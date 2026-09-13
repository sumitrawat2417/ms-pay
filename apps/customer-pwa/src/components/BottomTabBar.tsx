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
      className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto px-4 pb-safe mb-4"
      aria-label="Main navigation"
    >
      <div className="glass-card shadow-glass border border-white/20 rounded-full px-2 py-2">
        <div className="flex justify-between items-center px-2">
          {tabs.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              id={`tab-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center relative w-12 h-12 rounded-full transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active background pill */}
                  <div
                    className={`absolute inset-0 rounded-full bg-primary transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="relative z-10">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    {badge && pendingCount > 0 && (
                      <span className={`absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isActive ? 'bg-white text-primary' : 'bg-danger text-white'
                      }`}>
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
