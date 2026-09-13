import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

import MerchantHomePage from '@/pages/home/MerchantHomePage';
import StoreQRPage from '@/pages/qr/StoreQRPage';
import ScanConsumerPage from '@/pages/pay/ScanConsumerPage';
import ChargeConsumerPage from '@/pages/pay/ChargeConsumerPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setMerchantName = useAuthStore((s) => s.setMerchantName);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      setMerchantName("Sula's Coffee Shop");
    }
  }, [isAuthenticated, setMerchantName]);

  // if (!isAuthenticated) return <Navigate to="/splash" replace />;
  return <>{children}</>;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export function Router() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Protected */}
          <Route path="/" element={<RequireAuth><MerchantHomePage /></RequireAuth>} />
          <Route path="/store-qr" element={<RequireAuth><StoreQRPage /></RequireAuth>} />
          <Route path="/scan-consumer" element={<RequireAuth><ScanConsumerPage /></RequireAuth>} />
          <Route path="/charge/:consumerToken" element={<RequireAuth><ChargeConsumerPage /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
