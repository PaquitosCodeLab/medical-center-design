import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Shield, Users, CheckCircle, MoreVertical, Edit, Trash2, User, Mail, Clock, Calendar, UserPlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PermissionBadge } from '../components/PermissionBadge';
import { Badge } from '../components/Badge';
import { EditRoleModal, EditPermissionsModal, type RoleData } from '../components/EditRoleModal';
import { DeleteRoleModal } from '../components/DeleteRoleModal';
import { AssignUserToRoleModal } from '../components/AssignUserToRoleModal';

// Mock data - en producción vendría de una API
const roleData = {
  id: 1,
  name: 'Administrador del Sistema',
  description: 'Acceso completo al sistema con todos los permisos',
  color: 'blue',
  createdAt: '2026-01-15 10:30:00',
  lastModified: '2026-03-19 14:30:00',
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
        { key: 'create', label: 'Crear', granted: true },
        { key: 'update', label: 'Editar', granted: true },
        { key: 'delete', label: 'Eliminar', granted: false },
      ]
    }
  ],
  assignedUsers: [
    {
      id: 1,
      firstName: 'Carlos',
      lastName: 'Ramírez',
      email: 'carlos.ramirez@hospital.com',
      userType: 'Administrador',
      status: 'Confirmado',
      assignedAt: '2026-01-20 09:15:00'
    },
    {
      id: 2,
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@hospital.com',
      userType: 'Administrador',
      status: 'Confirmado',
      assignedAt: '2026-02-05 14:30:00'
    },
    {
      id: 3,
      firstName: 'Juan',
      lastName: 'Martínez',
      email: 'juan.martinez@hospital.com',
      userType: 'Administrador',
      status: 'Confirmado',
      assignedAt: '2026-02-18 11:45:00'
    },
    {
      id: 4,
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana.lopez@hospital.com',
      userType: 'Administrador',
      status: 'Pendiente',
      assignedAt: '2026-03-10 16:20:00'
    }
  ],
  stats: {
    totalUsers: 4,
    activeUsers: 3,
    pendingUsers: 1,
    totalPermissions: 28,
    grantedPermissions: 28
  }
};

export function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showPermsMenu, setShowPermsMenu] = useState(false);
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const permsMenuRef = useRef<HTMLDivElement>(null);
  const usersMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (permsMenuRef.current && !permsMenuRef.current.contains(event.target as Node)) {
        setShowPermsMenu(false);
      }
      if (usersMenuRef.current && !usersMenuRef.current.contains(event.target as Node)) {
        setShowUsersMenu(false);
      }
    };

    if (showMenu || showPermsMenu || showUsersMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showPermsMenu, showUsersMenu]);

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const colorVariants: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500'
  };

  const gradientVariants: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600'
  };

  // Handler functions for modals
  const handleEditRole = (updatedRole: RoleData) => {
    console.log('Rol actualizado:', updatedRole);
    // Aquí iría la lógica para actualizar el rol en la API
  };

  const handleDeleteRole = () => {
    console.log('Rol eliminado');
    // Aquí iría la lógica para eliminar el rol en la API
    navigate('/accounts/roles');
  };

  const handleAssignUser = (userId: number) => {
    console.log('Usuario asignado al rol:', userId);
    // Aquí iría la lógica para asignar el usuario al rol en la API
  };

  const handleUserClick = (userId: number) => {
    navigate(`/accounts/users/${userId}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/accounts/roles')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Rol</h1>
          <p className="text-xs text-gray-500">Información completa del rol y usuarios asignados</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className={`bg-gradient-to-r ${gradientVariants[roleData.color]} h-24 rounded-t-xl`}></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className={`w-24 h-24 rounded-xl ${colorVariants[roleData.color]} text-white flex items-center justify-center border-4 border-white shadow-lg`}>
              <Shield size={40} />
            </div>
            <div className="flex-1 mt-14">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {roleData.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{roleData.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="blue">
                        <Users size={12} />
                        {roleData.stats.totalUsers} usuarios
                      </Badge>
                      <Badge variant="green">
                        <CheckCircle size={12} />
                        {roleData.stats.grantedPermissions}/{roleData.stats.totalPermissions} permisos
                      </Badge>
                      <Badge variant="gray">
                        <Calendar size={12} />
                        Creado: {new Date(roleData.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Badge>
                      <Badge variant="gray">
                        <Clock size={12} />
                        Modificado: {new Date(roleData.lastModified).toLocaleString('es-ES', {
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
                      <button onClick={() => { setIsEditModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit size={12} />Editar Rol</button>
                      <button onClick={() => { setIsEditPermissionsModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Shield size={12} />Editar Permisos</button>
                      <button onClick={() => { setIsAssignUserModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><UserPlus size={12} />Asignar Usuario</button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => { setIsDeleteModalOpen(true); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} />Eliminar Rol</button>
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
          {/* Usuarios Asignados */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Users size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Usuarios Asignados</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="gray" size="sm">
                  {roleData.assignedUsers.length} usuarios
                </Badge>
              <div className="relative" ref={usersMenuRef}>
                <button onClick={() => setShowUsersMenu(!showUsersMenu)} className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <MoreVertical size={14} />
                </button>
                {showUsersMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    <button
                      onClick={() => { setIsAssignUserModalOpen(true); setShowUsersMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserPlus size={12} />
                      Asignar Usuario
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {roleData.assignedUsers.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                        <span className="text-gray-300">•</span>
                        <p className="text-[10px] text-gray-500">{user.userType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === 'Confirmado' ? 'green' : 'yellow'} size="sm">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Permisos */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Shield size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Permisos</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="gray" size="sm">
                  {roleData.modules.length} módulos
                </Badge>
              <div className="relative" ref={permsMenuRef}>
                <button onClick={() => setShowPermsMenu(!showPermsMenu)} className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <MoreVertical size={14} />
                </button>
                {showPermsMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    <button
                      onClick={() => { setIsEditPermissionsModalOpen(true); setShowPermsMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield size={12} />
                      Editar Permisos
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {roleData.modules.map((module, index) => {
                const moduleIcons: Record<string, string> = { user: '👤', role: '🛡️', person: '🧑‍🤝‍🧑', appointments: '📦' };
                const fullPerm = module.permissions.find(p => p.key === 'full');
                const allGranted = fullPerm?.granted && module.permissions.filter(p => p.key !== 'full').every(p => p.granted);

                return (
                  <div key={index} className="border border-gray-200 rounded-xl p-2.5 hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px]">{moduleIcons[module.key] || '📦'}</span>
                      <span className="text-[10px] font-semibold text-gray-900">{module.name}</span>
                    </div>

                    {allGranted ? (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-flex items-center gap-1">
                        <CheckCircle size={9} />Todos los permisos
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {module.permissions
                          .filter(p => p.key !== 'full')
                          .filter(p => p.granted)
                          .map((perm) => (
                            <span key={perm.key} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                              {perm.label}
                            </span>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        roleData={roleData}
        onSave={handleEditRole}
      />
      <EditPermissionsModal
        isOpen={isEditPermissionsModalOpen}
        onClose={() => setIsEditPermissionsModalOpen(false)}
        modules={roleData.modules}
        onSave={(modules) => console.log('Permisos actualizados:', modules)}
      />
      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteRole}
        roleName={roleData.name}
        assignedUsers={roleData.stats.totalUsers}
      />
      <AssignUserToRoleModal
        isOpen={isAssignUserModalOpen}
        onClose={() => setIsAssignUserModalOpen(false)}
        onAssign={handleAssignUser}
        roleName={roleData.name}
      />
    </div>
  );
}