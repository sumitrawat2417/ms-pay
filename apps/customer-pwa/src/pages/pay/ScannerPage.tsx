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

    html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      (decodedText) => {
        // Success callback
        html5QrCode.stop().then(() => {
          // Navigate to confirm pay with the scanned merchant token
          navigate(`/pay/confirm?token=${encodeURIComponent(decodedText)}`, { replace: true });
        });
      },
      () => {
        // Parse error, ignore normally unless it's a real camera error
      }
    ).catch((err) => {
      console.error('Failed to start scanner', err);
      setError('Could not access camera. Please check permissions.');
    });

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
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-white bg-danger/90 p-4 rounded-xl">{error}</p>
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
