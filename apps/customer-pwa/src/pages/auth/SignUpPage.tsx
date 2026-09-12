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
    <div className="page">
      {/* Header */}
      <div className="px-6 pt-14 pb-8">
        <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center mb-6">
          <User size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Enter your name to get started. Your unique wallet ID will be generated instantly.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1">
        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Sumit Rawat"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          className="input"
          autoFocus
          autoComplete="name"
        />
        <p className="text-xs text-muted-foreground mt-3">
          Your name appears on your wallet ID card shown to merchants.
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-12 mt-auto pt-8">
        <button
          id="signup-continue"
          onClick={handleContinue}
          disabled={!name.trim() || loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>Continue <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
