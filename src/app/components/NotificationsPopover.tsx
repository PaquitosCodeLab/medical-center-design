import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Calendar, UserPlus, Shield, Settings, CheckCheck } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  description: string;
  module: 'citas' | 'usuarios' | 'seguridad' | 'sistema';
  time: string;
  isRead: boolean;
}

const moduleConfig: Record<string, { label: string; icon: React.ElementType }> = {
  citas: { label: 'Citas', icon: Calendar },
  usuarios: { label: 'Usuarios', icon: UserPlus },
  seguridad: { label: 'Seguridad', icon: Shield },
  sistema: { label: 'Sistema', icon: Settings },
};

const initialNotifications: Notification[] = [
  { id: 1, title: 'Nueva cita programada', description: 'María García tiene una cita el 25 de marzo a las 10:00 AM con Dr. López', module: 'citas', time: 'Hace 5 min', isRead: false },
  { id: 2, title: 'Rol actualizado', description: 'Se actualizaron los permisos del rol Administrador del Sistema', module: 'seguridad', time: 'Hace 15 min', isRead: false },
  { id: 3, title: 'Nuevo usuario registrado', description: 'Ana Torres se ha registrado como nueva doctora en el sistema', module: 'usuarios', time: 'Hace 30 min', isRead: false },
  { id: 4, title: 'Mantenimiento programado', description: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM', module: 'sistema', time: 'Hace 1h', isRead: true },
  { id: 5, title: 'Cita cancelada', description: 'Carlos Díaz canceló su cita del 20 de marzo con Dra. Torres', module: 'citas', time: 'Hace 2h', isRead: true },
];

interface NotificationsPopoverProps {
  darkMode: boolean;
}

export function NotificationsPopover({ darkMode }: NotificationsPopoverProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/settings/notifications');
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-full transition-colors relative ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Popover panel */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50 ${darkMode ? 'bg-gray-900 border-gray-700 shadow-black/40' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className={`px-3 py-2.5 border-b flex items-center justify-between ${darkMode ? 'bg-gradient-to-r from-blue-950/50 to-blue-900/30 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-lg ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <Bell size={13} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold text-white bg-blue-600 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                <CheckCheck size={12} />
                Marcar todas
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[280px] overflow-y-auto">
            {notifications.map((notification) => {
              const ModuleIcon = moduleConfig[notification.module]?.icon || Bell;
              return (
                <button
                  key={notification.id}
                  onClick={() => toggleRead(notification.id)}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 transition-colors border-b last:border-0 ${
                    !notification.isRead
                      ? `border-l-2 border-l-blue-500 ${darkMode ? 'bg-blue-950/20 border-b-gray-800 hover:bg-blue-950/40' : 'bg-blue-50/30 border-b-gray-100 hover:bg-blue-50/60'}`
                      : `border-l-2 border-l-transparent ${darkMode ? 'border-b-gray-800 hover:bg-gray-800' : 'border-b-gray-100 hover:bg-gray-50'}`
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <ModuleIcon size={11} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] truncate ${!notification.isRead ? `font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` : `font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}>
                        {notification.title}
                      </span>
                      <span className={`text-[10px] flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {notification.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`px-3 py-2 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
            <button
              onClick={handleViewAll}
              className={`w-full text-center text-[10px] font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
