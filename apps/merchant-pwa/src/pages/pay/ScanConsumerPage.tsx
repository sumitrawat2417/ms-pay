import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft, Maximize } from 'lucide-react';

export default function ScanConsumerPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          html5QrCode = new Html5Qrcode("reader");

          const onScanSuccess = (decodedText: string) => {
            try {
              const payload = JSON.parse(decodedText);
              if (payload.type === 'consumer' && payload.consumerIdQrToken) {
                html5QrCode.stop().then(() => {
                  navigate(`/charge/${payload.consumerIdQrToken}`);
                });
              } else {
                setError("Invalid MS Pay Consumer QR");
              }
            } catch (e) {
              setError("Unrecognized QR Code");
            }
          };

          // Use the last camera (usually the back camera on phones) or the first available
          const cameraId = cameras.length > 1 ? cameras[cameras.length - 1].id : cameras[0].id;

          await html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            onScanSuccess,
            () => {}
          );
        } else {
          setError('No cameras found on this device.');
        }
      } catch (err: any) {
        console.error("Scanner start failed:", err);
        setError("Camera permission denied or no camera found.");
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [navigate]);

  // Dev-only helper to mock a scan
  const handleMockScan = () => {
    navigate('/charge/qr-consumer-001-demo');
  };

  return (
    <div className="page bg-black text-white flex flex-col h-screen">
      <header className="px-6 py-6 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="font-sora font-semibold text-lg">Scan Consumer ID</p>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Scanner Container */}
        <div className="relative w-full max-w-sm aspect-square rounded-[32px] overflow-hidden bg-white/5 border border-white/20 shadow-2xl">
          <div id="reader" className="w-full h-full object-cover"></div>
          
          {/* Target Overlay */}
          <div className="absolute inset-0 border-[3px] border-primary/50 m-8 rounded-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">
            <Maximize size={48} strokeWidth={1} />
          </div>
        </div>

        <div className="mt-8 text-center max-w-xs">
          <p className="text-lg font-sora font-semibold mb-2">Align QR Code</p>
          <p className="text-white/60 font-inter text-sm">
            Ask the consumer for their physical MS Pay card or in-app ID code.
          </p>
          {error && (
            <p className="mt-4 text-destructive font-medium text-sm bg-destructive/10 py-2 px-4 rounded-lg inline-block">
              {error}
            </p>
          )}

          {/* Dev mock button for testing without a real camera/QR */}
          <button
            onClick={handleMockScan}
            className="mt-6 px-4 py-2 bg-white/10 rounded-lg text-sm text-white/80 active:scale-95 transition-transform"
          >
            Simulate Scan (Dev)
          </button>
        </div>
      </div>
    </div>
  );
}
