import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Store, HelpCircle, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { storeName, ownerName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold font-sora mb-6">Account</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase font-sora">
            {storeName?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold font-sora">{storeName}</h2>
            <p className="text-muted-foreground text-sm mt-1">{ownerName}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Settings Group */}
        <div className="space-y-2">
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store Details</h3>
          <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft">
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <User className="text-primary" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">Owner Name</p>
                <p className="text-xs text-muted-foreground">{ownerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <Store className="text-primary" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">Store Name</p>
                <p className="text-xs text-muted-foreground">{storeName}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="space-y-2">
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preferences</h3>
          <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft">
            <button className="w-full flex items-center gap-3 p-4 border-b border-border/50 active:bg-muted/50 transition-colors">
              <Settings className="text-muted-foreground" size={20} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">App Settings</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 active:bg-muted/50 transition-colors">
              <HelpCircle className="text-muted-foreground" size={20} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Help & Support</p>
              </div>
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 mt-8 rounded-2xl bg-danger/10 text-danger font-semibold active:scale-[0.98] transition-transform border border-danger/20"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
