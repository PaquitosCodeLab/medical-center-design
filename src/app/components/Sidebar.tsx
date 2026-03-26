import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useSidebar } from './SidebarContext';
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
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  Wrench,
  Server,
  List
} from 'lucide-react';

interface NavChild {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={16} />,
    label: 'Dashboard',
    path: '/',
  },
  {
    icon: <Calendar size={16} />,
    label: 'Citas',
    path: '/appointments',
  },
  {
    icon: <Users size={16} />,
    label: 'Personas',
    children: [
      { label: 'Doctores', path: '/doctors', icon: <Stethoscope size={14} /> },
      { label: 'Pacientes', path: '/patients', icon: <Heart size={14} /> },
    ],
  },
  {
    icon: <User size={16} />,
    label: 'Cuentas',
    children: [
      { label: 'Usuarios', path: '/accounts/users', icon: <UserCircle size={14} /> },
      { label: 'Roles', path: '/accounts/roles', icon: <Shield size={14} /> },
    ],
  },
  {
    icon: <Wrench size={16} />,
    label: 'Configuraciones',
    children: [
      { label: 'Sistema', path: '/config/system', icon: <Server size={14} /> },
      { label: 'Catálogos', path: '/config/catalogs', icon: <List size={14} /> },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Personas', 'Cuentas', 'Configuraciones']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isOpen = !collapsed || hovered;

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string, children?: NavChild[]) => {
    if (path) return location.pathname === path;
    if (children) return children.some(child => location.pathname.startsWith(child.path));
    return false;
  };

  return (
    <aside
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setUserMenuOpen(false); }}
      className={`bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 ${isOpen ? 'w-60' : 'w-16'}`}
    >
      {/* Logo + Collapse */}
      <div className={`p-4 flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Stethoscope size={16} />
        </div>
        {isOpen && (
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs truncate">Sistema Médico</div>
            <div className="text-[10px] text-blue-300 truncate">Gestión Integral</div>
          </div>
        )}
        <button
          onClick={() => { setCollapsed(!collapsed); setHovered(false); }}
          className={`p-1 text-blue-300 hover:text-white hover:bg-blue-600/50 rounded-lg transition-colors flex-shrink-0 ${!isOpen ? 'hidden' : ''}`}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.path ? (
              <Link
                to={item.path}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-600/50'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="text-xs flex-1 truncate">{item.label}</span>}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => isOpen ? toggleExpand(item.label) : undefined}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2 rounded-lg transition-colors ${
                    isActive(undefined, item.children)
                      ? 'bg-blue-600/30 text-white'
                      : 'text-blue-100 hover:bg-blue-600/50'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isOpen && (
                    <>
                      <span className="text-xs flex-1 text-left truncate">{item.label}</span>
                      {expandedItems.includes(item.label) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </>
                  )}
                </button>
                {/* Sub-items: show icons only when collapsed, full when open */}
                {isOpen ? (
                  expandedItems.includes(item.label) && item.children && (
                    <div className="mt-0.5 ml-3 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-xs ${
                            location.pathname.startsWith(child.path)
                              ? 'bg-blue-600 text-white'
                              : 'text-blue-100 hover:bg-blue-600/50'
                          }`}
                        >
                          <span className="flex-shrink-0 opacity-70">{child.icon}</span>
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )
                ) : (
                  item.children && (
                    <div className="mt-0.5 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          title={child.label}
                          className={`w-full flex items-center justify-center py-1.5 rounded-lg transition-colors ${
                            location.pathname.startsWith(child.path)
                              ? 'bg-blue-600 text-white'
                              : 'text-blue-200/60 hover:text-blue-100 hover:bg-blue-600/50'
                          }`}
                        >
                          <span className="flex-shrink-0">{child.icon}</span>
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-2 py-2 border-t border-blue-600">
        <button
          onClick={() => isOpen && setUserMenuOpen(!userMenuOpen)}
          title={!isOpen ? 'Henry Gadea' : undefined}
          className={`w-full flex items-center ${isOpen ? 'gap-3' : 'justify-center'} hover:bg-blue-600/30 rounded-lg p-2 transition-colors`}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-medium">HG</span>
          </div>
          {isOpen && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-medium truncate">Henry Gadea</div>
                <div className="text-[10px] text-blue-300">DEV</div>
              </div>
              <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {isOpen && userMenuOpen && (
          <div className="mt-2 pt-2 -mx-2 px-2 border-t border-blue-600 space-y-1">
            <Link to="/profile" className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-xs text-blue-100 hover:bg-blue-600/50">
              <UserCircle size={14} />Perfil
            </Link>
            <Link to="/settings/preferences" className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-xs text-blue-100 hover:bg-blue-600/50">
              <Settings size={14} />Preferencias
            </Link>
            <Link to="/settings/notifications" className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-xs text-blue-100 hover:bg-blue-600/50">
              <Bell size={14} />Notificaciones
            </Link>
            <button onClick={() => {}} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-xs text-blue-100 hover:bg-red-500/50">
              <LogOut size={14} />Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
