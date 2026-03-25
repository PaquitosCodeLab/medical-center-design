import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Shield, CheckCircle, XCircle, Clock, MapPin, Globe, Monitor, Calendar, User, Phone, IdCard, Cake, MoreVertical, Edit, Trash2, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PermissionBadge } from '../components/PermissionBadge';
import { Badge } from '../components/Badge';
import { EditUserModal, type UserData } from '../components/EditUserModal';
import { DeleteUserModal } from '../components/DeleteUserModal';
import { EditBasicInfoModal, type BasicInfoData } from '../components/EditBasicInfoModal';
import { EditContactsModal, type ContactsData } from '../components/EditContactsModal';
import { EditAddressesModal, type AddressesData } from '../components/EditAddressesModal';

// Mock data - en producción vendría de una API
const userData = {
  id: 1,
  firstName: 'Carlos',
  lastName: 'Ramírez',
  email: 'carlos.ramirez@hospital.com',
  userType: 'Administrador',
  status: 'Confirmado',
  profilePicture: 'CR',
  clerkId: 'user_2abcdef123456',
  createdAt: '2026-01-15 10:30:00',
  lastModified: '2026-03-19 14:30:00',
  permissions: [], // Add permissions array
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
      timestamp: '2026-03-19 09:15:32',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 2,
      event: 'Cambio de contraseña',
      timestamp: '2026-03-18 14:22:10',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 3,
      event: 'Inicio de sesión exitoso',
      timestamp: '2026-03-18 08:45:12',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 4,
      event: 'Cierre de sesión',
      timestamp: '2026-03-17 18:30:45',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    },
    {
      id: 5,
      event: 'Inicio de sesión exitoso',
      timestamp: '2026-03-17 08:15:22',
      ip: '192.168.1.105',
      userAgent: 'Chrome 120.0.0 (Windows 10)',
      location: 'Madrid, España'
    }
  ],
  linkedPerson: {
    firstName: 'Carlos',
    lastName: 'Ramírez García',
    identificationType: 'DNI',
    identificationNumber: '12345678A',
    birthDate: '1985-06-15',
    age: 40,
    gender: 'Masculino',
    phones: [
      { number: '+34 612 345 678', type: 'Móvil', isPrimary: true },
      { number: '+34 91 234 5678', type: 'Trabajo', isPrimary: false },
      { number: '+34 612 987 654', type: 'Casa', isPrimary: false }
    ],
    emails: [
      { address: 'carlos.ramirez.personal@gmail.com', type: 'Personal', isPrimary: true },
      { address: 'carlos.ramirez@hospital.com', type: 'Trabajo', isPrimary: false }
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
    ]
  }
};

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showPersonMenu, setShowPersonMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const personMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (personMenuRef.current && !personMenuRef.current.contains(event.target as Node)) {
        setShowPersonMenu(false);
      }
    };

    if (showMenu || showPersonMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showPersonMenu]);

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const getEventIcon = (event: string) => {
    if (event.includes('Inicio de sesión')) return <CheckCircle size={16} className="text-green-600" />;
    if (event.includes('Cierre de sesión')) return <XCircle size={16} className="text-gray-600" />;
    return <Clock size={16} className="text-blue-600" />;
  };

  // Handler functions for modals
  const handleEditUser = (updatedUser: UserData) => {
    console.log('Usuario actualizado:', updatedUser);
    // Aquí iría la lógica para actualizar el usuario en la API
  };

  const handleDeleteUser = () => {
    console.log('Usuario eliminado');
    // Aquí iría la lógica para eliminar el usuario en la API
    navigate('/accounts/users');
  };

  const handleEditBasicInfo = (updatedBasicInfo: BasicInfoData) => {
    console.log('Información básica actualizada:', updatedBasicInfo);
    // Aquí iría la lógica para actualizar la información básica en la API
  };

  const handleEditContacts = (updatedContacts: ContactsData) => {
    console.log('Contactos actualizados:', updatedContacts);
    // Aquí iría la lógica para actualizar los contactos en la API
  };

  const handleEditAddresses = (updatedAddresses: AddressesData) => {
    console.log('Direcciones actualizadas:', updatedAddresses);
    // Aquí iría la lógica para actualizar las direcciones en la API
  };

  // Helper functions for phone, email, and address type icons
  const getPhoneTypeIcon = (type: string) => {
    return <Phone size={14} className="text-blue-600" />;
  };

  const getEmailTypeIcon = (type: string) => {
    return <Mail size={14} className="text-blue-600" />;
  };

  const getAddressTypeIcon = (type: string) => {
    return <MapPin size={14} className="text-blue-600" />;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/accounts/users')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Usuario</h1>
          <p className="text-xs text-gray-500">Información completa y actividad del usuario</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button 
                onClick={() => {
                  setIsEditModalOpen(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={14} />
                Editar Usuario
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Eliminar Usuario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 rounded-t-xl"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
              {getInitials(userData.firstName, userData.lastName)}
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={userData.status === 'Confirmado' ? 'green' : 'yellow'}>
                        {userData.status}
                      </Badge>
                      <Badge variant="blue">
                        <Shield size={12} />
                        {userData.userType}
                      </Badge>
                      <Badge variant="gray">
                        <Clock size={12} />
                        {new Date(userData.lastModified).toLocaleString('es-ES', { 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Roles Asignados */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Shield size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Roles Asignados</h3>
                <Badge variant="gray" size="sm" className="ml-auto">
                  {userData.roles.length} {userData.roles.length === 1 ? 'rol' : 'roles'}
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {userData.roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-xs font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={14} className="text-blue-600" />
                    {role.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.modules.map((module, index) => (
                      <PermissionBadge
                        key={index}
                        moduleName={module.name}
                        moduleKey={module.key}
                        permissions={module.permissions}
                        color={module.color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permisos Directos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <CheckCircle size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Permisos Directos</h3>
                <Badge variant="gray" size="sm" className="ml-auto">
                  {userData.directModules.length} módulos
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {userData.directModules.map((module, index) => (
                  <PermissionBadge
                    key={index}
                    moduleName={module.name}
                    moduleKey={module.key}
                    permissions={module.permissions}
                    color={module.color}
                  />
                ))}
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
                  Últimas {userData.activityHistory.length} actividades
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {userData.activityHistory.map((activity) => (
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
                        <Globe size={12} />
                        <span>{activity.ip}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor size={12} />
                        <span>{activity.userAgent}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
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
          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <User size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Información de Cuenta</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                  <Mail size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Correo Electrónico</label>
                  <p className="text-xs text-gray-900 font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
                  <IdCard size={14} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">ID Externo (Clerk)</label>
                  <p className="text-[10px] text-gray-900 font-mono">{userData.clerkId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                  <Calendar size={14} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Fecha de Creación</label>
                  <p className="text-xs text-gray-900 font-medium">
                    {new Date(userData.createdAt).toLocaleString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                  <Clock size={14} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Última Modificación</label>
                  <p className="text-xs text-gray-900 font-medium">
                    {new Date(userData.lastModified).toLocaleString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Persona Vinculada */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Persona Vinculada</h3>
                </div>
                <div className="relative" ref={personMenuRef}>
                  <button
                    onClick={() => setShowPersonMenu(!showPersonMenu)}
                    className="p-1.5 text-gray-600 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {showPersonMenu && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                      <button 
                        onClick={() => {
                          setIsBasicInfoModalOpen(true);
                          setShowPersonMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <IdCard size={14} />
                        Editar Información Básica
                      </button>
                      <button 
                        onClick={() => {
                          setIsContactsModalOpen(true);
                          setShowPersonMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Phone size={14} />
                        Editar Contactos
                      </button>
                      <button 
                        onClick={() => {
                          setIsAddressesModalOpen(true);
                          setShowPersonMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MapPin size={14} />
                        Editar Direcciones
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
                  <User size={14} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Nombre Completo</label>
                  <p className="text-xs text-gray-900 font-medium">
                    {userData.linkedPerson.firstName} {userData.linkedPerson.lastName}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                    <IdCard size={10} />
                    Identificación
                  </label>
                  <p className="text-xs text-gray-900 font-medium">{userData.linkedPerson.identificationType}</p>
                  <p className="text-[10px] text-gray-600 font-mono">{userData.linkedPerson.identificationNumber}</p>
                </div>
                <div className="flex flex-col gap-1 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                    <Cake size={10} />
                    Edad
                  </label>
                  <p className="text-xs text-gray-900 font-medium">{userData.linkedPerson.age} años</p>
                  <p className="text-[10px] text-gray-600">{userData.linkedPerson.birthDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
                  <User size={14} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Género</label>
                  <p className="text-xs text-gray-900 font-medium">{userData.linkedPerson.gender}</p>
                </div>
              </div>
              
              {/* Teléfonos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Phone size={10} />
                  Teléfonos
                </label>
                <div className="space-y-2">
                  {userData.linkedPerson.phones.map((phone, index) => (
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

              {/* Correos Electrónicos */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <Mail size={10} />
                  Correos Electrónicos
                </label>
                <div className="space-y-2">
                  {userData.linkedPerson.emails.map((email, index) => (
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

              {/* Direcciones */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin size={10} />
                  Direcciones
                </label>
                <div className="space-y-2.5">
                  {userData.linkedPerson.addresses.map((address, index) => (
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
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleEditUser}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        userName={`${userData.firstName} ${userData.lastName}`}
        userEmail={userData.email}
      />
      <EditBasicInfoModal
        isOpen={isBasicInfoModalOpen}
        onClose={() => setIsBasicInfoModalOpen(false)}
        basicInfoData={{
          identifications: [{ 
            type: userData.linkedPerson.identificationType, 
            number: userData.linkedPerson.identificationNumber 
          }],
          gender: userData.linkedPerson.gender,
          birthDate: userData.linkedPerson.birthDate,
        }}
        onSave={handleEditBasicInfo}
      />
      <EditContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
        contactsData={{
          emails: userData.linkedPerson.emails,
          phones: userData.linkedPerson.phones,
        }}
        onSave={handleEditContacts}
      />
      <EditAddressesModal
        isOpen={isAddressesModalOpen}
        onClose={() => setIsAddressesModalOpen(false)}
        addressesData={{
          addresses: userData.linkedPerson.addresses,
        }}
        onSave={handleEditAddresses}
      />
    </div>
  );
}