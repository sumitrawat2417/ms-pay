import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogIn, ChevronRight } from 'lucide-react';
import { loginConsumer, setAuthUser } from '@ms-pay/api-client';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleContinue = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await loginConsumer(phone.trim());
      if (res.success && res.data) {
        setAuthUser(res.data.id);
        login(res.data.id, `${res.data.firstName} ${res.data.lastName}`, res.data.idQrToken);
        // Assuming they already set a passcode if they have an account
        navigate('/home');
      } else {
        setError(res.error || 'Login failed. Invalid phone number.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7B2FF7]/20 blur-[120px] pointer-events-none" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      {/* Header */}
      <div className="px-6 pt-20 pb-8 relative z-10 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,47,247,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
          <LogIn size={26} className="text-white relative z-10 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Log in to MS Pay</h1>
        <p className="text-white/60 mt-3 text-[17px] leading-relaxed font-medium">
          Enter your registered phone number to access your account.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1 relative z-10 animate-slide-up mt-4">
        <div className="relative group">
          <input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-5 text-white placeholder:text-white/30 focus:border-[#7B2FF7]/50 focus:bg-white/10 transition-all duration-300 text-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] outline-none"
            autoFocus
          />
          <div className="absolute inset-0 rounded-2xl bg-[#7B2FF7]/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 pointer-events-none" />
        </div>
        {error && <p className="text-danger text-sm mt-3 px-2 font-medium">{error}</p>}
      </div>

      {/* CTA */}
      <div className="px-6 pb-12 mt-auto pt-8 relative z-10">
        <button
          id="login-continue"
          onClick={handleContinue}
          disabled={!phone.trim() || loading}
          className="w-full bg-[#7B2FF7] text-white rounded-2xl h-[60px] font-semibold text-lg hover:bg-[#6820df] transition-colors flex items-center justify-center gap-2 relative overflow-hidden group mb-6 shadow-[0_0_30px_rgba(123,47,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
          ) : (
            <>
              <span className="relative z-10">Access Wallet</span>
              <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="text-center">
          <Link to="/signup" className="text-white/50 hover:text-white transition-colors text-sm font-medium">
            Don't have a wallet? Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
