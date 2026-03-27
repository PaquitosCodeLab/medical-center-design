import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { HeaderProvider } from './HeaderContext';
import { useSidebar } from './SidebarContext';
import { useTheme } from './ThemeContext';

export function Layout() {
  const { collapsed } = useSidebar();
  const { darkMode } = useTheme();

  return (
    <HeaderProvider>
      <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Sidebar />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
          <main className="flex-1 overflow-y-auto relative">
            <Header />
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
}
