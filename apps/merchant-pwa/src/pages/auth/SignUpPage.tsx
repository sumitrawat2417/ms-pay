import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { registerMerchant } from '@ms-pay/api-client';

export default function SignUpPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [ownerName, setOwnerName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !storeName || !phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await registerMerchant(ownerName, storeName, phone, category);
      if (res.success && res.data) {
        login(res.data.id, res.data.ownerName, res.data.storeName, res.data.storeQrToken);
        navigate('/', { replace: true });
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden font-inter dark">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF8A3D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7B2FF7]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      <main className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto animate-slide-up">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 font-sora">
              Partner with MS Pay
            </h1>
            <p className="text-white/60 text-[15px]">
              Set up your merchant account to start accepting digital payments instantly.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-6 shadow-elevation-high">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-start gap-3">
                <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-danger text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 ml-1">Store Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sula's Coffee Shop"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 ml-1">Owner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sumit Rawat"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 ml-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-3.5 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\\D/g, ''))}
                    disabled={loading}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 ml-1">Category (Optional)</label>
                <select
                  className="w-full bg-[#111] border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <option value="" className="text-white/50">Select category...</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail & Shopping">Retail & Shopping</option>
                  <option value="Services">Services</option>
                  <option value="Grocery">Grocery</option>
                  <option value="General">General</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-2xl mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A3D] to-[#FF5D8F] transition-transform duration-300 group-hover:scale-105" />
                <div className="relative py-4 flex items-center justify-center text-white font-semibold text-[17px] shadow-[0_8px_24px_rgba(255,138,61,0.25)]">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </div>
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/50 text-[15px]">
              Already a merchant?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-[#FF8A3D] font-semibold hover:text-[#FF8A3D]/80 transition-colors"
                disabled={loading}
              >
                Sign In
              </button>
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
