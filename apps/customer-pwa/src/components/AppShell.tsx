import { Outlet } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';
import { OfflineBanner } from './OfflineBanner';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
