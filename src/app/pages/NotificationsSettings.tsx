import { Bell, Calendar, UserPlus, Shield, FileText, AlertCircle, Settings, CheckCheck, Mail as MailIcon, Check, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../components/Badge';

type ModuleFilter = 'all' | 'citas' | 'usuarios' | 'seguridad' | 'sistema';
type ReadFilter = 'all' | 'unread' | 'read';

interface Notification {
  id: number;
  title: string;
  description: string;
  module: 'citas' | 'usuarios' | 'seguridad' | 'sistema';
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: 'Nueva cita agendada', description: 'María García agendó una cita con Dr. López para el 26/03/2026 a las 09:00 AM', module: 'citas', time: 'Hace 5 min', isRead: false },
  { id: 2, title: 'Nuevo usuario registrado', description: 'Pedro Fernández se ha registrado en el sistema como Recepcionista', module: 'usuarios', time: 'Hace 15 min', isRead: false },
  { id: 3, title: 'Cita cancelada', description: 'Carlos Díaz canceló su cita del 25/03/2026 con Dra. Torres', module: 'citas', time: 'Hace 30 min', isRead: false },
  { id: 4, title: 'Rol actualizado', description: 'Se actualizaron los permisos del rol "Doctor" — 3 permisos añadidos', module: 'seguridad', time: 'Hace 1h', isRead: false },
  { id: 5, title: 'Actualización del sistema', description: 'Versión 2.4.1 disponible con mejoras de rendimiento y corrección de errores', module: 'sistema', time: 'Hace 2h', isRead: true },
  { id: 6, title: 'Recordatorio de cita', description: 'La cita de Ana Rodríguez con Dr. Sánchez es mañana a las 11:00 AM', module: 'citas', time: 'Hace 3h', isRead: true },
  { id: 7, title: 'Contraseña cambiada', description: 'Tu contraseña fue actualizada exitosamente', module: 'seguridad', time: 'Hace 4h', isRead: true },
  { id: 8, title: 'Usuario desactivado', description: 'La cuenta de Docker Test fue desactivada por inactividad', module: 'usuarios', time: 'Hace 5h', isRead: true },
  { id: 9, title: 'Nueva cita agendada', description: 'Juan Pérez agendó una cita con Dra. Martínez para el 27/03/2026 a las 10:30 AM', module: 'citas', time: 'Hace 6h', isRead: true },
  { id: 10, title: 'Mantenimiento programado', description: 'El sistema estará en mantenimiento el 28/03/2026 de 02:00 a 04:00 AM', module: 'sistema', time: 'Hace 8h', isRead: true },
  { id: 11, title: 'Permisos actualizados', description: 'Se asignaron permisos directos de lectura a Sofía Torres', module: 'seguridad', time: 'Hace 1d', isRead: true },
  { id: 12, title: 'Cita reprogramada', description: 'Laura Fernández reprogramó su cita del 24/03 al 28/03/2026', module: 'citas', time: 'Hace 1d', isRead: true },
];

const moduleConfig = {
  citas: { label: 'Citas', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  usuarios: { label: 'Usuarios', icon: UserPlus, color: 'bg-blue-100 text-blue-600' },
  seguridad: { label: 'Seguridad', icon: Shield, color: 'bg-blue-100 text-blue-600' },
  sistema: { label: 'Sistema', icon: Settings, color: 'bg-blue-100 text-blue-600' },
};

export function NotificationsSettings() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    const matchesModule = moduleFilter === 'all' || n.module === moduleFilter;
    const matchesRead = readFilter === 'all' || (readFilter === 'unread' ? !n.isRead : n.isRead);
    return matchesModule && matchesRead;
  });

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const moduleFilters: { value: ModuleFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'citas', label: 'Citas' },
    { value: 'usuarios', label: 'Usuarios' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'sistema', label: 'Sistema' },
  ];

  const readFilters: { value: ReadFilter; label: string; count?: number }[] = [
    { value: 'all', label: 'Todas', count: notifications.length },
    { value: 'unread', label: 'Sin leer', count: unreadCount },
    { value: 'read', label: 'Leídas', count: notifications.length - unreadCount },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Notificaciones</h1>
          <p className="text-[10px] text-gray-500">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Bell size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Bandeja de Entrada</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold text-white bg-blue-600 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="gray" size="sm">{filteredNotifications.length} notificaciones</Badge>
              <div className="relative" ref={menuRef}>
                <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <MoreVertical size={14} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <button onClick={() => { markAllRead(); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <CheckCheck size={12} />Marcar todas como leídas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bars */}
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between gap-4">
          {/* Read/Unread Filter */}
          <div className="flex items-center gap-1">
            {readFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setReadFilter(f.value)}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                  readFilter === f.value
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
                <span className={`text-[9px] px-1 py-0.5 rounded-full ${
                  readFilter === f.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-1">
            {moduleFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setModuleFilter(f.value)}
                className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                  moduleFilter === f.value
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const config = moduleConfig[notif.module];
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => toggleRead(notif.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                    !notif.isRead ? 'border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon size={13} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[10px] leading-relaxed ${!notif.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[9px] text-gray-400 flex-shrink-0 mt-0.5">{notif.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{notif.description}</p>
                  </div>

                  {/* Module Badge + Read Action */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                      {config.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(notif.id);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={notif.isRead ? 'Marcar como no leída' : 'Marcar como leída'}
                    >
                      {notif.isRead ? <MailIcon size={12} /> : <Check size={12} />}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                <Bell size={20} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 mb-1">No hay notificaciones</p>
              <p className="text-[10px] text-gray-400">Ajusta tus filtros para ver más resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
