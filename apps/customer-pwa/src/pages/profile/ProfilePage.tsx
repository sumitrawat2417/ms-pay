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
    <div className="page pb-28">
      <header className="px-6 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account and settings
          </p>
        </div>
      </header>

      <div className="px-6 mb-8">
        <div className="bg-white border border-border/50 p-6 rounded-[32px] flex items-center gap-5 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center text-white text-xl font-bold shadow-md relative z-10">
            {consumerName?.charAt(0)}
          </div>
          <div className="flex-1 relative z-10">
            <h2 className="text-xl font-bold text-foreground truncate">{consumerName}</h2>
            <p className="text-muted-foreground text-sm font-mono mt-1 bg-muted/50 inline-block px-2 py-0.5 rounded-md">ID: {consumerId}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => navigate('/passcode/reset')}
            className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Shield size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 font-semibold text-foreground text-[15px]">Change Passcode</div>
          </button>
          <div className="h-px bg-border/50 mx-4" />
          <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left group">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <CreditCard size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 font-semibold text-foreground text-[15px]">Linked Accounts</div>
          </button>
          <div className="h-px bg-border/50 mx-4" />
          <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left group">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Settings size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 font-semibold text-foreground text-[15px]">Settings</div>
          </button>
          <div className="h-px bg-border/50 mx-4" />
          <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left group">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Info size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 font-semibold text-foreground text-[15px]">Help & Support</div>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-danger/20 rounded-full p-4 flex items-center justify-center gap-2 hover:bg-danger/5 transition-colors text-danger font-bold shadow-sm"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
