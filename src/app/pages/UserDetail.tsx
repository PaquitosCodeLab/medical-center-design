import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Shield, CheckCircle, XCircle, Clock, MapPin, Globe, Monitor, Calendar, User, Phone, IdCard, Cake, MoreVertical, Edit, Trash2, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
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
  useHeader({ title: 'Detalle del Usuario', subtitle: 'Información completa y actividad del usuario', backTo: '/accounts/users' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showPersonMenu, setShowPersonMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [showPermissionsMenu, setShowPermissionsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const personMenuRef = useRef<HTMLDivElement>(null);
  const rolesMenuRef = useRef<HTMLDivElement>(null);
  const permissionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
      if (personMenuRef.current && !personMenuRef.current.contains(event.target as Node)) setShowPersonMenu(false);
      if (rolesMenuRef.current && !rolesMenuRef.current.contains(event.target as Node)) setShowRolesMenu(false);
      if (permissionsMenuRef.current && !permissionsMenuRef.current.contains(event.target as Node)) setShowPermissionsMenu(false);
    };

    if (showMenu || showPersonMenu || showRolesMenu || showPermissionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showPersonMenu, showRolesMenu, showPermissionsMenu]);

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
                        <Calendar size={12} />
                        Creado: {new Date(userData.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Badge>
                      <Badge variant="gray">
                        <Clock size={12} />
                        Modificado: {new Date(userData.lastModified).toLocaleString('es-ES', {
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
                <div className="relative flex-shrink-0" ref={menuRef}>
                  <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mt-1">
                    <MoreVertical size={18} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button onClick={() => { setIsEditModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit size={12} />Editar Usuario</button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => { setIsDeleteModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} />Eliminar Usuario</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Roles */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Shield size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Roles</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="gray" size="sm">
                    {userData.roles.length} {userData.roles.length === 1 ? 'rol' : 'roles'}
                  </Badge>
                  <div className="relative" ref={rolesMenuRef}>
                  <button onClick={() => setShowRolesMenu(!showRolesMenu)} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors">
                    <MoreVertical size={14} />
                  </button>
                  {showRolesMenu && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      <button onClick={() => { setIsEditRolesModalOpen(true); setShowRolesMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-[10px] text-gray-700 hover:bg-gray-50 transition-colors">
                        <Edit size={12} />
                        Editar Roles
                      </button>
                    </div>
                  )}
                </div>
                </div>
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

          {/* Permisos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Permisos</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="gray" size="sm">
                    {userData.directModules.length} módulos
                  </Badge>
                  <div className="relative" ref={permissionsMenuRef}>
                  <button onClick={() => setShowPermissionsMenu(!showPermissionsMenu)} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors">
                    <MoreVertical size={14} />
                  </button>
                  {showPermissionsMenu && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      <button onClick={() => { setIsEditPermissionsModalOpen(true); setShowPermissionsMenu(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-[10px] text-gray-700 hover:bg-gray-50 transition-colors">
                        <Edit size={12} />
                        Editar Permisos
                      </button>
                    </div>
                  )}
                </div>
                </div>
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
          {/* Información del Usuario */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Información del Usuario</h3>
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
              {/* Info unificada */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {userData.linkedPerson.firstName[0]}{userData.linkedPerson.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-gray-900">{userData.linkedPerson.firstName} {userData.linkedPerson.lastName}</span>
                    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-100">{userData.userType}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>{userData.linkedPerson.gender}</span>
                    <span>·</span>
                    <span>{userData.linkedPerson.age} años</span>
                    <span>·</span>
                    <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${userData.status === 'Confirmado' ? 'text-green-600 bg-green-50 border-green-100' : 'text-yellow-600 bg-yellow-50 border-yellow-100'}`}>{userData.status}</span>
                  </p>
                </div>
              </div>

              {/* Identificaciones */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <IdCard size={10} className="text-gray-400" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase">Identificaciones</span>
                </div>
                {[
                  { type: userData.linkedPerson.identificationType, number: userData.linkedPerson.identificationNumber, isPrimary: true },
                  { type: 'Pasaporte', number: 'ES9876543', isPrimary: false },
                ].map((id, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><IdCard size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{id.number}</p>
                      <p className="text-[9px] text-gray-500">{id.type}</p>
                    </div>
                    {id.isPrimary && <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Teléfonos */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <Phone size={10} className="text-gray-400" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase">Teléfonos</span>
                </div>
                {userData.linkedPerson.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><Phone size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{phone.number}</p>
                      <p className="text-[9px] text-gray-500">{phone.type}</p>
                    </div>
                    {phone.isPrimary && <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Correos */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <Mail size={10} className="text-gray-400" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase">Correos</span>
                </div>
                {userData.linkedPerson.emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><Mail size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{email.address}</p>
                      <p className="text-[9px] text-gray-500">{email.type}</p>
                    </div>
                    {email.isPrimary && <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
              </div>

              {/* Direcciones */}
              <div className="bg-gray-50 rounded-lg border border-gray-100">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                  <MapPin size={10} className="text-gray-400" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase">Direcciones</span>
                </div>
                {userData.linkedPerson.addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0"><MapPin size={11} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{address.street}</p>
                      <p className="text-[9px] text-gray-500">{address.city}, {address.postalCode} · {address.type}</p>
                    </div>
                    {address.isPrimary && <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Principal</span>}
                  </div>
                ))}
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
          firstName: userData.linkedPerson.firstName,
          lastName: userData.linkedPerson.lastName,
          userType: userData.userType,
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
      {/* Edit Roles Modal */}
      <EditUserModal
        isOpen={isEditRolesModalOpen}
        onClose={() => setIsEditRolesModalOpen(false)}
        userData={userData}
        onSave={handleEditUser}
        section="roles"
      />
      {/* Edit Permissions Modal */}
      <EditUserModal
        isOpen={isEditPermissionsModalOpen}
        onClose={() => setIsEditPermissionsModalOpen(false)}
        userData={userData}
        onSave={handleEditUser}
        section="permissions"
      />
    </div>
  );
}