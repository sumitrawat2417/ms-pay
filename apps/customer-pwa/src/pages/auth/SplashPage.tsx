import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function SplashPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center brand-gradient relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-20%] right-[-20%] w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-15%] w-80 h-80 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }} />

      {/* Logo mark */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-bold text-white font-sora tracking-tight">M</span>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">MS Pay</h1>
          <p className="text-white/70 text-sm mt-2 font-medium">Your virtual currency wallet</p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            style={{ animation: `pulseGlow 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
