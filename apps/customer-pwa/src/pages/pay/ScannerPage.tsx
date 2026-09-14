import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ChevronLeft, Flashlight } from 'lucide-react';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialize scanner
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        try {
          await html5QrCode.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
            (decodedText) => {
              html5QrCode.stop().then(() => {
                navigate(`/pay/confirm?token=${encodeURIComponent(decodedText)}`, { replace: true });
              });
            },
            () => {}
          );
        } catch (e) {
          // Fallback to any camera
          await html5QrCode.start(
            { facingMode: 'user' },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
            (decodedText) => {
              html5QrCode.stop().then(() => {
                navigate(`/pay/confirm?token=${encodeURIComponent(decodedText)}`, { replace: true });
              });
            },
            () => {}
          );
        }
      } catch (err) {
        console.error('Failed to start scanner', err);
        setError('Could not access camera. Please check permissions.');
      }
    };

    startScanner();

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-white bg-black/40 rounded-full backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center text-white bg-black/40 rounded-full backdrop-blur-md"
          onClick={() => alert('Torch toggle requires native API integration')}
        >
          <Flashlight size={20} />
        </button>
      </header>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="bg-card p-6 rounded-[32px] border border-border/50 shadow-sm">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4 text-danger">
              <Flashlight size={24} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Camera Unavailable</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {error} If you are on a desktop without a camera, you can simulate a successful scan to continue testing.
            </p>
            <button
              onClick={() => navigate('/pay/confirm?token=qr-store-001', { replace: true })}
              className="btn-primary w-full"
            >
              Simulate Scan (Test)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div id="qr-reader" className="flex-1 w-full h-full object-cover [&>video]:object-cover" />
          
          {/* Overlay mask using border (html5-qrcode adds its own qrbox, but we style around it) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            <div className="flex-1 bg-black/50" />
            <div className="flex justify-between">
              <div className="flex-1 bg-black/50" />
              {/* This is the cutout, size should match qrbox */}
              <div className="w-[250px] h-[250px] relative">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              </div>
              <div className="flex-1 bg-black/50" />
            </div>
            <div className="flex-1 bg-black/50 flex flex-col items-center justify-start pt-12">
              <p className="text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                Scan Merchant QR Code
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
