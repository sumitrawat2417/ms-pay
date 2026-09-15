import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function SplashPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/', { replace: true });
      } else {
        navigate('/signup', { replace: true });
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Dynamic Background Orbs - using merchant orange/magenta */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF8A3D]/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#7B2FF7]/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      {/* Logo mark */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-24 h-24 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,138,61,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          <span className="text-4xl font-bold text-white font-sora tracking-tight relative z-10 drop-shadow-md">MS</span>
        </div>

        <div className="text-center mt-2">
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">MS Merchant</h1>
          <p className="text-white/60 text-sm mt-3 font-medium tracking-wide">BUSINESS DASHBOARD</p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            style={{ animation: `pulseGlow 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
