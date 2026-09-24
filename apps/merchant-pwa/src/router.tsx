import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Auth Pages
const SplashPage = React.lazy(() => import('@/pages/auth/SplashPage'));
const SignUpPage = React.lazy(() => import('@/pages/auth/SignUpPage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));

// Main Pages
import MerchantHomePage from '@/pages/home/MerchantHomePage';
import StoreQRPage from '@/pages/qr/StoreQRPage';
import ScanConsumerPage from '@/pages/pay/ScanConsumerPage';
import ChargeConsumerPage from '@/pages/pay/ChargeConsumerPage';
import HistoryPage from '@/pages/history/HistoryPage';
import ProfilePage from '@/pages/account/ProfilePage';
import AppShell from '@/components/AppShell';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  if (!isAuthenticated) return <Navigate to="/splash" replace />;
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
          {/* Auth */}
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected with AppShell */}
          <Route element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route path="/" element={<MerchantHomePage />} />
            <Route path="/store-qr" element={<StoreQRPage />} />
            <Route path="/scan-consumer" element={<ScanConsumerPage />} />
            <Route path="/charge/:consumerToken" element={<ChargeConsumerPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
