import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope,
  User,
  Shield,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  UserCircle,
  LogOut
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
    path: '/',
  },
  {
    icon: <Calendar size={18} />,
    label: 'Citas',
    path: '/appointments',
  },
  {
    icon: <Users size={18} />,
    label: 'Personas',
    children: [
      { label: 'Doctores', path: '/doctors' },
      { label: 'Pacientes', path: '/patients' },
    ],
  },
  {
    icon: <User size={18} />,
    label: 'Cuentas',
    children: [
      { label: 'Usuarios', path: '/accounts/users' },
      { label: 'Roles', path: '/accounts/roles' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Personas', 'Cuentas']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string, children?: { label: string; path: string }[]) => {
    if (path) {
      return location.pathname === path;
    }
    if (children) {
      return children.some(child => location.pathname.startsWith(child.path));
    }
    return false;
  };

  return (
    <aside className="w-60 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Stethoscope size={20} />
        </div>
        <div>
          <div className="font-semibold text-sm">Sistema Médico</div>
          <div className="text-xs text-blue-300">Gestión Integral</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.path ? (
              <Link
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-600/50'
                }`}
              >
                {item.icon}
                <span className="text-sm flex-1">{item.label}</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(undefined, item.children)
                      ? 'bg-blue-600/30 text-white'
                      : 'text-blue-100 hover:bg-blue-600/50'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm flex-1 text-left">{item.label}</span>
                  {expandedItems.includes(item.label) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {expandedItems.includes(item.label) && item.children && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                          location.pathname.startsWith(child.path)
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-100 hover:bg-blue-600/50'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-600">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 hover:bg-blue-600/30 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">HG</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Henry Gadea</div>
            <div className="text-xs text-blue-300">DEV</div>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {userMenuOpen && (
          <div className="mt-2 pt-2 border-t border-blue-600 space-y-1">
            <Link
              to="/profile"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-blue-100 hover:bg-blue-600/50"
            >
              <UserCircle size={16} />
              Perfil
            </Link>
            <Link
              to="/settings/preferences"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-blue-100 hover:bg-blue-600/50"
            >
              <Settings size={16} />
              Preferencias
            </Link>
            <Link
              to="/settings/notifications"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-blue-100 hover:bg-blue-600/50"
            >
              <Bell size={16} />
              Notificaciones
            </Link>
            <button
              onClick={() => {/* Lógica de cerrar sesión */}}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-blue-100 hover:bg-red-500/50"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}