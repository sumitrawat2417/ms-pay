import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    emoji: '📱',
    title: 'No Device Needed',
    subtitle: 'Pay in-store without installing anything. Just show your ID or let the merchant handle it.',
    gradient: 'from-[#FF5D8F] to-[#FF8A3D]',
  },
  {
    emoji: '📷',
    title: 'Scan & Pay',
    subtitle: 'Scan the merchant\'s QR code, enter the amount, confirm with your passcode. Done.',
    gradient: 'from-[#FF8A3D] to-[#7B2FF7]',
  },
  {
    emoji: '✅',
    title: 'Approve Requests',
    subtitle: 'Merchants can send you payment requests. Review the full amount before you approve.',
    gradient: 'from-[#7B2FF7] to-[#FF5D8F]',
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-12">
        <button onClick={() => navigate('/signup')} className="text-muted-foreground text-sm font-medium">
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div
          className={`w-40 h-40 rounded-[40px] bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-2xl mb-12 animate-fade-in`}
          key={current}
        >
          <span className="text-7xl" role="img" aria-label={slide.title}>{slide.emoji}</span>
        </div>

        <div className="text-center animate-slide-up" key={`text-${current}`}>
          <h2 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h2>
          <p className="text-muted-foreground text-base leading-relaxed">{slide.subtitle}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-border'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-12">
        <button id="onboarding-next" onClick={next} className="btn-primary flex items-center justify-center gap-2">
          {current < slides.length - 1 ? 'Next' : 'Get Started'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
