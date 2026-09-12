import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Lazy-load all pages for code splitting
const SplashPage      = React.lazy(() => import('@/pages/auth/SplashPage'));
const OnboardingPage  = React.lazy(() => import('@/pages/auth/OnboardingPage'));
const SignUpPage       = React.lazy(() => import('@/pages/auth/SignUpPage'));
const SetPasscodePage  = React.lazy(() => import('@/pages/auth/SetPasscodePage'));

const AppShell        = React.lazy(() => import('@/components/AppShell'));
const HomePage        = React.lazy(() => import('@/pages/home/HomePage'));
const MyQRPage        = React.lazy(() => import('@/pages/home/MyQRPage'));

const ScannerPage     = React.lazy(() => import('@/pages/pay/ScannerPage'));
const ConfirmPayPage  = React.lazy(() => import('@/pages/pay/ConfirmPayPage'));
const PaySuccessPage  = React.lazy(() => import('@/pages/pay/PaySuccessPage'));

const RequestsPage    = React.lazy(() => import('@/pages/requests/RequestsPage'));
const RequestDetailPage = React.lazy(() => import('@/pages/requests/RequestDetailPage'));
const ChooseAmountPage = React.lazy(() => import('@/pages/recharge/ChooseAmountPage'));
const PaymentMethodPage = React.lazy(() => import('@/pages/recharge/PaymentMethodPage'));
const RechargeConfirmPage = React.lazy(() => import('@/pages/recharge/RechargeConfirmPage'));

const HistoryPage       = React.lazy(() => import('@/pages/history/HistoryPage'));
const TxDetailPage      = React.lazy(() => import('@/pages/history/TxDetailPage'));
const ProfilePage       = React.lazy(() => import('@/pages/profile/ProfilePage'));
const PasscodeResetPage = React.lazy(() => import('@/pages/profile/PasscodeResetPage'));

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
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth */}
          <Route path="/splash"   element={<SplashPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/signup"   element={<SignUpPage />} />
          <Route path="/passcode/set" element={<SetPasscodePage />} />

          {/* Protected — App shell with bottom nav */}
          <Route path="/" element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home"    element={<HomePage />} />
            <Route path="my-qr"   element={<MyQRPage />} />

            <Route path="pay/scan"    element={<ScannerPage />} />
            <Route path="pay/confirm" element={<ConfirmPayPage />} />
            <Route path="pay/success" element={<PaySuccessPage />} />

            <Route path="requests"          element={<RequestsPage />} />
            <Route path="requests/:id"      element={<RequestDetailPage />} />
            <Route path="recharge"          element={<ChooseAmountPage />} />
            <Route path="recharge/method"   element={<PaymentMethodPage />} />
            <Route path="recharge/confirm"  element={<RechargeConfirmPage />} />

            <Route path="history"           element={<HistoryPage />} />
            <Route path="history/:id"       element={<TxDetailPage />} />

            <Route path="profile"           element={<ProfilePage />} />
            <Route path="passcode/reset"    element={<PasscodeResetPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
