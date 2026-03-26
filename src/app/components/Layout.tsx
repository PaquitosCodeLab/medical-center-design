import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from './SidebarContext';
import { useTheme } from './ThemeContext';

export function Layout() {
  const { collapsed } = useSidebar();
  const { darkMode } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Sidebar />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <Header />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
