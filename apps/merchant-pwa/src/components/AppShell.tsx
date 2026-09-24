import { Outlet } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';
import { OfflineBanner } from './OfflineBanner';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background max-w-[430px] mx-auto relative shadow-2xl overflow-hidden">
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto pb-safe">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
