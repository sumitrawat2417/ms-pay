import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    emoji: '📱',
    title: 'No Device Needed',
    subtitle: 'Pay in-store without installing anything. Just show your ID or let the merchant handle it.',
    glowColor: 'bg-primary',
  },
  {
    emoji: '📷',
    title: 'Scan & Pay',
    subtitle: 'Scan the merchant\'s QR code, enter the amount, confirm with your passcode. Done.',
    glowColor: 'bg-[#FF8A3D]',
  },
  {
    emoji: '✅',
    title: 'Approve Requests',
    subtitle: 'Merchants can send you payment requests. Review the full amount before you approve.',
    glowColor: 'bg-[#7B2FF7]',
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else navigate('/signup');
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow based on current slide */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-20 flex items-center justify-center pointer-events-none">
        <div className={`w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${slide.glowColor}`} />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"><filter id=\\"noise\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23noise)\\"/></svg>")' }} />

      {/* Skip */}
      <div className="flex justify-end px-6 pt-12 relative z-10">
        <button onClick={() => navigate('/signup')} className="text-white/60 hover:text-white transition-colors text-sm font-semibold tracking-wide uppercase">
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative z-10">
        <div
          className="w-40 h-40 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl mb-12 animate-fade-in relative overflow-hidden"
          key={current}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
          <span className="text-7xl relative z-10 drop-shadow-lg" role="img" aria-label={slide.title}>{slide.emoji}</span>
        </div>

        <div className="text-center animate-slide-up" key={`text-${current}`}>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">{slide.title}</h2>
          <p className="text-white/60 text-[17px] leading-relaxed max-w-[280px] mx-auto font-medium">{slide.subtitle}</p>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="relative z-10 px-6 pb-12 mt-auto">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button id="onboarding-next" onClick={next} className="btn-primary flex items-center justify-center gap-2 relative overflow-hidden group">
          <span className="relative z-10 font-bold">{current < slides.length - 1 ? 'Next' : 'Get Started'}</span>
          <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
