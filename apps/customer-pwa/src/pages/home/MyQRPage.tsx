import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { ChevronLeft, Sun } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function MyQRPage() {
  const navigate = useNavigate();
  const { consumerName, idQrToken } = useAuthStore();

  // Try to boost brightness (simulated hint)
  useEffect(() => {
    // In a real native app, we'd use an API to set screen brightness to max.
    // In a PWA, we can't easily change device brightness, but we can show a hint.
  }, []);

  return (
    <div className="min-h-screen flex flex-col brand-gradient">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-white bg-black/10 rounded-full backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-white mr-10">
          My ID Card
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-[320px] bg-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          {/* Card branding */}
          <div className="absolute top-0 left-0 right-0 h-2 brand-gradient" />
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">{consumerName}</h2>
            <p className="text-slate-500 text-sm mt-1">MS Pay Customer</p>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mx-auto w-fit">
            <QRCode
              value={idQrToken || 'error'}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="mt-8 flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <Sun size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Show this QR code to the merchant to pay or receive money. Turn up your screen brightness for faster scanning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
