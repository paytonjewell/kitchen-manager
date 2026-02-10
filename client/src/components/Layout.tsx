import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { MobileNavigation } from './MobileNavigation';

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
}
