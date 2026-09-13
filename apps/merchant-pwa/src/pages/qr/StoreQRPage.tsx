import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, QrCode as QRIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { QRCodeSVG } from 'qrcode.react'; // We need to install this

export default function StoreQRPage() {
  const navigate = useNavigate();
  const merchantName = useAuthStore((s) => s.merchantName) || 'Store Owner';
  const qrToken = useAuthStore((s) => s.idQrToken) || 'merchant-demo-token';

  // Construct standard payment request intent payload
  const qrPayload = JSON.stringify({
    intent: 'payment',
    type: 'merchant',
    merchantStoreQrToken: qrToken,
    merchantName: merchantName
  });

  return (
    <div className="page pb-20 flex flex-col items-center">
      {/* Top Nav */}
      <header className="w-full px-6 py-6 flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-sm active:scale-95 transition-transform text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-sora font-semibold text-foreground text-lg">Receive Payment</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-sm active:scale-95 transition-transform text-foreground">
          <Share2 size={18} />
        </button>
      </header>

      {/* QR Code Container */}
      <div className="w-full px-8 flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="bg-card w-full max-w-sm rounded-[32px] p-8 shadow-elevation-high border border-border flex flex-col items-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <QRIcon size={32} />
          </div>

          <h2 className="text-2xl font-bold font-sora text-foreground mb-1 text-center">{merchantName}</h2>
          <p className="text-muted-foreground text-sm font-inter mb-8 text-center">Scan to pay with MS Pay</p>
          
          <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
            <QRCodeSVG 
              value={qrPayload}
              size={220}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>

          <p className="text-xs font-mono text-muted-foreground/50 tracking-wider">
            ID: {qrToken.substring(0, 12).toUpperCase()}...
          </p>
        </div>
      </div>
    </div>
  );
}
