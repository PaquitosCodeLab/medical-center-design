import { UserCircle, Mail, Phone, MapPin, Calendar, Shield, MoreVertical, Edit, TrendingUp, Activity, Clock, CheckCircle, Globe, Monitor, Briefcase, XCircle, Smartphone, Home as HomeIcon, User, Lock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../components/Badge';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { EditContactsModal, type ContactsData } from '../components/EditContactsModal';
import { EditAddressesModal, type AddressesData } from '../components/EditAddressesModal';

// Mock data - en producción vendría de una API o contexto de autenticación
const currentUser = {
  id: 1,
  firstName: 'Carlos',
  lastName: 'Ramírez',
  email: 'carlos.ramirez@hospital.com',
  phone: '+34 612 345 678',
  userType: 'Administrador',
  status: 'Confirmado',
  profilePicture: 'CR',
  clerkId: 'user_2abcdef123456',
  location: 'Madrid, España',
  createdAt: '2026-01-15 10:30:00',
  lastLogin: '2026-03-20 09:15:00',
  permissions: [],
  roles: [
    {
      id: 1,
      name: 'Administrador del Sistema',
      modules: [
        {
          name: 'Usuarios',
          key: 'user',
          color: 'blue',
          permissions: [
            { key: 'full', label: 'Completo', granted: true },
            { 
              key: 'read', 
              label: 'Lectura', 
              granted: true,
              children: [
                { key: 'list', label: 'Listar', granted: true },
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: true },
            { key: 'assignRole', label: 'Asignar Rol', granted: true },
            { key: 'assignPermission', label: 'Asignar Permiso', granted: true },
          ]
        },
        {
          name: 'Roles',
          key: 'role',
          color: 'purple',
          permissions: [
            { key: 'full', label: 'Completo', granted: true },
            { 
              key: 'read', 
              label: 'Lectura', 
              granted: true,
              children: [
                { key: 'list', label: 'Listar', granted: true },
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: true },
            { key: 'assignUser', label: 'Asignar Usuario', granted: true },
            { key: 'assignPermission', label: 'Asignar Permiso', granted: true },
          ]
        },
        {
          name: 'Personas',
          key: 'person',
          color: 'green',
          permissions: [
            { key: 'full', label: 'Completo', granted: true },
            { 
              key: 'read', 
              label: 'Lectura', 
              granted: true,
              children: [
                { key: 'list', label: 'Listar', granted: true },
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: true },
          ]
        },
        {
          name: 'Citas',
          key: 'appointments',
          color: 'purple',
          permissions: [
            { key: 'full', label: 'Completo', granted: true },
            { 
              key: 'read', 
              label: 'Lectura', 
              granted: true,
              children: [
                { key: 'list', label: 'Listar', granted: true },
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: true },
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Editor de Contenido',
      modules: [
        {
          name: 'Personas',
          key: 'person',
          color: 'green',
          permissions: [
            { key: 'full', label: 'Completo', granted: false },
            { 
              key: 'read', 
              label: 'Lectura', 
              granted: true,
              children: [
                { key: 'list', label: 'Listar', granted: true },
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: false },
          ]
        }
      ]
    }
  ],
  directModules: [
    {
      name: 'Usuarios',
      key: 'user',
      color: 'blue',
      permissions: [
        { key: 'full', label: 'Completo', granted: false },
        { 
          key: 'read', 
          label: 'Lectura', 
          granted: true,
          children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true },
          ]
        },
        { key: 'create', label: 'Crear', granted: false },
        { key: 'update', label: 'Editar', granted: false },
        { key: 'delete', label: 'Eliminar', granted: false },
        { key: 'assignRole', label: 'Asignar Rol', granted: true },
        { key: 'assignPermission', label: 'Asignar Permiso', granted: false },
      ]
    },
    {
      name: 'Roles',
      key: 'role',
      color: 'purple',
      permissions: [
        { key: 'full', label: 'Completo', granted: false },
        { 
          key: 'read', 
          label: 'Lectura', 
          granted: true,
          children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: false },
          ]
        },
        { key: 'create', label: 'Crear', granted: false },
        { key: 'update', label: 'Editar', granted: false },
        { key: 'delete', label: 'Eliminar', granted: false },
        { key: 'assignUser', label: 'Asignar Usuario', granted: false },
        { key: 'assignPermission', label: 'Asignar Permiso', granted: false },
      ]
    }
  ],
  activityHistory: [
    {
      id: 1,
      event: 'Inicio de sesión exitoso',
      timestamp: '2026-03-20 09:15:32',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 2,
      event: 'Cambio de contraseña',
      timestamp: '2026-03-19 14:22:10',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 3,
      event: 'Inicio de sesión exitoso',
      timestamp: '2026-03-19 08:45:12',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 4,
      event: 'Cierre de sesión',
      timestamp: '2026-03-18 18:30:45',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 5,
      event: 'Inicio de sesión exitoso',
      timestamp: '2026-03-18 08:15:22',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    }
  ],
  phones: [
    { number: '+34 612 345 678', type: 'Móvil', isPrimary: true },
    { number: '+34 91 234 5678', type: 'Trabajo', isPrimary: false }
  ],
  emails: [
    { address: 'carlos.ramirez@hospital.com', type: 'Trabajo', isPrimary: true },
    { address: 'carlos.ramirez.personal@gmail.com', type: 'Personal', isPrimary: false }
  ],
  addresses: [
    { 
      street: 'Calle Mayor 123', 
      city: 'Madrid', 
      postalCode: '28013', 
      country: 'España',
      type: 'Casa',
      isPrimary: true 
    },
    { 
      street: 'Av. de la Castellana 261', 
      city: 'Madrid', 
      postalCode: '28046', 
      country: 'España',
      type: 'Trabajo',
      isPrimary: false 
    }
  ],
  stats: {
    totalLogins: 142,
    lastPasswordChange: '2026-03-19',
    accountAge: 64, // días
    sessionsThisMonth: 28
  }
};

// --- Chart Mock Data ---
const loginsPorMes = [
  { mes: 'Oct', logins: 18 },
  { mes: 'Nov', logins: 24 },
  { mes: 'Dic', logins: 15 },
  { mes: 'Ene', logins: 28 },
  { mes: 'Feb', logins: 22 },
  { mes: 'Mar', logins: 31 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
      <p className="text-[10px] font-medium text-gray-500 mb-0.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs font-semibold text-gray-900">{entry.value}</p>
      ))}
    </div>
  );
}

export function Profile() {
  const [isEditContactsModalOpen, setIsEditContactsModalOpen] = useState(false);
  const [isEditAddressesModalOpen, setIsEditAddressesModalOpen] = useState(false);
  const [showContactsMenu, setShowContactsMenu] = useState(false);
  const [showAddressesMenu, setShowAddressesMenu] = useState(false);
  const contactsMenuRef = useRef<HTMLDivElement>(null);
  const addressesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactsMenuRef.current && !contactsMenuRef.current.contains(event.target as Node)) {
        setShowContactsMenu(false);
      }
      if (addressesMenuRef.current && !addressesMenuRef.current.contains(event.target as Node)) {
        setShowAddressesMenu(false);
      }
    };

    if (showContactsMenu || showAddressesMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactsMenu, showAddressesMenu]);

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const handleEditContacts = (contacts: ContactsData) => {
    console.log('Contactos actualizados:', contacts);
  };

  const handleEditAddresses = (addresses: AddressesData) => {
    console.log('Direcciones actualizadas:', addresses);
  };

  const getEventIcon = (event: string) => {
    if (event.includes('Inicio de sesión')) return <CheckCircle size={16} className="text-green-600" />;
    if (event.includes('Cierre de sesión')) return <XCircle size={16} className="text-gray-600" />;
    return <Clock size={16} className="text-blue-600" />;
  };

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case 'Trabajo':
        return <Briefcase size={10} className="text-blue-600" />;
      case 'Personal':
        return <User size={10} className="text-blue-600" />;
      default:
        return <Mail size={10} className="text-blue-600" />;
    }
  };

  const getPhoneTypeIcon = (type: string) => {
    switch (type) {
      case 'Móvil':
        return <Smartphone size={10} className="text-blue-600" />;
      case 'Trabajo':
        return <Briefcase size={10} className="text-blue-600" />;
      case 'Casa':
        return <HomeIcon size={10} className="text-blue-600" />;
      default:
        return <Phone size={10} className="text-blue-600" />;
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'Casa':
        return <HomeIcon size={10} className="text-blue-600" />;
      case 'Trabajo':
        return <Briefcase size={10} className="text-blue-600" />;
      default:
        return <MapPin size={10} className="text-blue-600" />;
    }
  };

  // Calcular total de permisos
  const totalPermissions = currentUser.roles.reduce((total, role) => {
    return total + role.modules.reduce((moduleTotal, module) => {
      return moduleTotal + module.permissions.length;
    }, 0);
  }, 0) + currentUser.directModules.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Mi Perfil</h1>
          <p className="text-xs text-gray-500">Información personal y configuración de cuenta</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 rounded-t-xl"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span className="text-sm">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentUser.status === 'Confirmado' ? 'green' : 'yellow'}>
                        {currentUser.status}
                      </Badge>
                      <Badge variant="blue">
                        <Shield size={12} />
                        {currentUser.userType}
                      </Badge>
                      <Badge variant="gray">
                        <Calendar size={12} />
                        Creado: {new Date(currentUser.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Badge>
                      <Badge variant="gray">
                        <Clock size={12} />
                        Último acceso: {new Date(currentUser.lastLogin).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Total de Accesos</p>
              <p className="text-sm font-semibold text-gray-900">{currentUser.stats.totalLogins}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Activity size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Sesiones del Mes</p>
              <p className="text-sm font-semibold text-gray-900">{currentUser.stats.sessionsThisMonth}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Roles Asignados</p>
              <p className="text-sm font-semibold text-gray-900">{currentUser.roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Calendar size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Días de Antigüedad</p>
              <p className="text-sm font-semibold text-gray-900">{currentUser.stats.accountAge}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Accesos por Mes - Area Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <TrendingUp size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Accesos por Mes</h3>
                <Badge variant="gray" size="sm" className="ml-auto">Últimos 6 meses</Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loginsPorMes} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="profileBlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} fill="url(#profileBlueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Historial de Actividad */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Clock size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Historial de Actividad</h3>
                <Badge variant="gray" size="sm" className="ml-auto">
                  Últimas {currentUser.activityHistory.length} actividades
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {currentUser.activityHistory.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0">
                  <div className="mt-0.5">
                    {getEventIcon(activity.event)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900">{activity.event}</p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{activity.timestamp}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[10px] text-gray-600">
                      <div className="flex items-center gap-1">
                        <Globe size={10} />
                        <span>{activity.ip}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor size={10} />
                        <span>{activity.userAgent}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Resumen Rápido */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Activity size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Resumen de Cuenta</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-600" />
                  <span className="text-[10px] text-gray-700">Roles</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{currentUser.roles.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-[10px] text-gray-700">Permisos</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{totalPermissions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-purple-600" />
                  <span className="text-[10px] text-gray-700">Sesiones</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{currentUser.stats.sessionsThisMonth}/mes</span>
              </div>
            </div>
          </div>

          {/* Contactos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Mail size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Contactos</h3>
                <Badge variant="gray" size="sm">
                  {currentUser.emails.length + currentUser.phones.length}
                </Badge>
              </div>
              <div className="relative" ref={contactsMenuRef}>
                <button
                  onClick={() => setShowContactsMenu(!showContactsMenu)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <MoreVertical size={14} />
                </button>
                {showContactsMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsEditContactsModalOpen(true);
                        setShowContactsMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={12} />
                      Editar Contactos
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-4">
              {/* Correos Electrónicos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Mail size={10} />
                  Correos Electrónicos
                </label>
                <div className="space-y-2">
                  {currentUser.emails.map((email, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-lg p-3 transition-all ${
                        email.isPrimary 
                          ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                          : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      {email.isPrimary && (
                        <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          Principal
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {getEmailTypeIcon(email.type)}
                        <span className="text-[10px] font-medium text-gray-600">{email.type}</span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium truncate">{email.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teléfonos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Phone size={10} />
                  Teléfonos
                </label>
                <div className="space-y-2">
                  {currentUser.phones.map((phone, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-lg p-3 transition-all ${
                        phone.isPrimary 
                          ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                          : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      {phone.isPrimary && (
                        <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          Principal
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {getPhoneTypeIcon(phone.type)}
                        <span className="text-[10px] font-medium text-gray-600">{phone.type}</span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium">{phone.number}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direcciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Direcciones</h3>
                <Badge variant="gray" size="sm">
                  {currentUser.addresses.length}
                </Badge>
              </div>
              <div className="relative" ref={addressesMenuRef}>
                <button
                  onClick={() => setShowAddressesMenu(!showAddressesMenu)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <MoreVertical size={14} />
                </button>
                {showAddressesMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsEditAddressesModalOpen(true);
                        setShowAddressesMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={12} />
                      Editar Direcciones
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              {currentUser.addresses.map((address, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-lg p-3 transition-all ${
                    address.isPrimary 
                      ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md shadow-sm' 
                      : 'border border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  {address.isPrimary && (
                    <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                      Principal
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mb-2">
                    {getAddressTypeIcon(address.type)}
                    <span className="text-[10px] font-medium text-gray-600">{address.type}</span>
                  </div>
                  <p className="text-xs text-gray-900 font-medium">{address.street}</p>
                  <p className="text-[10px] text-gray-600 mt-1">{address.city}, {address.postalCode}</p>
                  <p className="text-[10px] text-gray-600">{address.country}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditContactsModal
        isOpen={isEditContactsModalOpen}
        onClose={() => setIsEditContactsModalOpen(false)}
        contactsData={currentUser}
        onSave={handleEditContacts}
      />
      <EditAddressesModal
        isOpen={isEditAddressesModalOpen}
        onClose={() => setIsEditAddressesModalOpen(false)}
        addressesData={currentUser}
        onSave={handleEditAddresses}
      />
    </div>
  );
}