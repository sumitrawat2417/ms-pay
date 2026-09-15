import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { User, ChevronRight } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleContinue = async () => {
    if (!name.trim()) return;
    setLoading(true);
    // Simulate API call to create consumer and get QR token
    await new Promise((r) => setTimeout(r, 800));
    // Store temporary auth — passcode will be set next
    login('consumer-001', name.trim(), 'qr-consumer-001-demo');
    navigate('/passcode/set');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      {/* Header */}
      <div className="px-6 pt-20 pb-8 relative z-10 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,93,143,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
          <User size={26} className="text-white relative z-10 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Create your account</h1>
        <p className="text-white/60 mt-3 text-[17px] leading-relaxed font-medium">
          Enter your name to get started. Your unique wallet ID will be generated instantly.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1 relative z-10 animate-slide-up mt-4">
        <div className="relative group">
          <input
            id="name"
            type="text"
            placeholder="e.g. Sumit Rawat"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-5 text-white placeholder:text-white/30 focus:border-primary/50 focus:bg-white/10 transition-all duration-300 text-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] outline-none"
            autoFocus
            autoComplete="name"
          />
          {/* Subtle glow on focus */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 pointer-events-none" />
        </div>
        <p className="text-sm text-white/40 mt-4 px-2">
          Your name appears on your wallet ID card shown to merchants.
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-12 mt-auto pt-8 relative z-10">
        <button
          id="signup-continue"
          onClick={handleContinue}
          disabled={!name.trim() || loading}
          className="btn-primary flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
          ) : (
            <>
              <span className="relative z-10 font-bold text-lg">Continue</span>
              <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
