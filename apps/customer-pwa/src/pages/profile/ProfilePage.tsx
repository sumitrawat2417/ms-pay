import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Shield, User, Settings, Info, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { consumerName, consumerId, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/onboarding', { replace: true });
  };

  return (
    <div className="page pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User size={24} className="text-primary" />
          Profile
        </h1>
      </header>

      <div className="px-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center text-white text-xl font-bold shadow-md">
            {consumerName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground truncate">{consumerName}</h2>
            <p className="text-muted-foreground text-sm font-mono mt-1">ID: {consumerId}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-3">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => navigate('/passcode/reset')}
            className="w-full flex items-center gap-3 p-4 hover:bg-card-elevated transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div className="flex-1 font-semibold text-foreground">Change Passcode</div>
          </button>
          <div className="h-px bg-border ml-16" />
          <button className="w-full flex items-center gap-3 p-4 hover:bg-card-elevated transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard size={20} className="text-primary" />
            </div>
            <div className="flex-1 font-semibold text-foreground">Linked Accounts</div>
          </button>
          <div className="h-px bg-border ml-16" />
          <button className="w-full flex items-center gap-3 p-4 hover:bg-card-elevated transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings size={20} className="text-primary" />
            </div>
            <div className="flex-1 font-semibold text-foreground">Settings</div>
          </button>
          <div className="h-px bg-border ml-16" />
          <button className="w-full flex items-center gap-3 p-4 hover:bg-card-elevated transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Info size={20} className="text-primary" />
            </div>
            <div className="flex-1 font-semibold text-foreground">Help & Support</div>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-card border border-danger/20 rounded-3xl p-4 flex items-center justify-center gap-2 hover:bg-danger/5 transition-colors mt-6 text-danger font-bold"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
