import { useState } from 'react';
import { Modal, ModalButton } from './Modal';
import { Search, User, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './Badge';
import { PermissionBadge } from './PermissionBadge';

interface AssignUserToRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (userIds: number[]) => void;
  roleName: string;
}

// Mock users data - en producción vendría de una API
const availableUsers = [
  {
    id: 5,
    firstName: 'Laura',
    lastName: 'Sánchez',
    email: 'laura.sanchez@hospital.com',
    userType: 'Doctor',
    status: 'Confirmado',
    roles: [
      {
        id: 3,
        name: 'Doctor',
        modules: [
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
          { key: 'create', label: 'Crear', granted: false },
          { key: 'update', label: 'Editar', granted: false },
          { key: 'delete', label: 'Eliminar', granted: false },
        ]
      }
    ]
  },
  {
    id: 6,
    firstName: 'Pedro',
    lastName: 'Fernández',
    email: 'pedro.fernandez@hospital.com',
    userType: 'Recepcionista',
    status: 'Confirmado',
    roles: [
      {
        id: 4,
        name: 'Recepcionista',
        modules: [
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
    directModules: []
  },
  {
    id: 7,
    firstName: 'Sofía',
    lastName: 'Torres',
    email: 'sofia.torres@hospital.com',
    userType: 'Enfermera',
    status: 'Pendiente',
    roles: [],
    directModules: [
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
              { key: 'get', label: 'Detalle', granted: false },
            ]
          },
          { key: 'create', label: 'Crear', granted: false },
          { key: 'update', label: 'Editar', granted: false },
          { key: 'delete', label: 'Eliminar', granted: false },
        ]
      }
    ]
  },
  {
    id: 8,
    firstName: 'Miguel',
    lastName: 'Ruiz',
    email: 'miguel.ruiz@hospital.com',
    userType: 'Administrador',
    status: 'Confirmado',
    roles: [
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
    directModules: []
  },
  {
    id: 9,
    firstName: 'Carmen',
    lastName: 'Jiménez',
    email: 'carmen.jimenez@hospital.com',
    userType: 'Doctor',
    status: 'Confirmado',
    roles: [],
    directModules: []
  }
];

export function AssignUserToRoleModal({ isOpen, onClose, onAssign, roleName }: AssignUserToRoleModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<typeof availableUsers>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setExpandedUsers(new Set());
    onClose();
  };

  const handleAssign = () => {
    if (selectedUsers.length > 0) {
      onAssign(selectedUsers.map(u => u.id));
      handleClose();
    }
  };

  const handleSelectUser = (user: typeof availableUsers[0]) => {
    // Verificar si el usuario ya está seleccionado
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    const newExpandedUsers = new Set(expandedUsers);
    newExpandedUsers.delete(userId);
    setExpandedUsers(newExpandedUsers);
  };

  const toggleExpanded = (userId: number) => {
    const newExpandedUsers = new Set(expandedUsers);
    if (newExpandedUsers.has(userId)) {
      newExpandedUsers.delete(userId);
    } else {
      newExpandedUsers.add(userId);
    }
    setExpandedUsers(newExpandedUsers);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  // Filtrar usuarios por búsqueda y excluir los ya seleccionados
  const filteredUsers = availableUsers.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);
    const notSelected = !selectedUsers.find(u => u.id === user.id);
    return matchesSearch && notSelected;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Asignar Usuarios al Rol"
      maxWidth="2xl"
      footer={
        <>
          <ModalButton onClick={handleClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton 
            onClick={handleAssign} 
            variant="primary"
            disabled={selectedUsers.length === 0}
          >
            Asignar {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-3">
        {/* Info del Rol */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-blue-600" />
            <p className="text-xs text-blue-900">
              Asignando al rol: <span className="font-semibold">{roleName}</span>
            </p>
          </div>
        </div>

        {/* Búsqueda de Usuario */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Buscar Usuario
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o correo electrónico..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Lista de Resultados de Búsqueda */}
        {searchQuery && (
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.status === 'Confirmado' ? 'green' : 'yellow'} size="sm">
                      {user.status}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        )}

        {/* Lista de Usuarios Seleccionados */}
        {selectedUsers.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">
              Usuarios Seleccionados ({selectedUsers.length})
            </label>
            {selectedUsers.map((selectedUser) => {
              const isExpanded = expandedUsers.has(selectedUser.id);
              return (
                <div key={selectedUser.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header del Usuario - Siempre Visible */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-xs font-semibold border-2 border-white/40">
                        {getInitials(selectedUser.firstName, selectedUser.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h4>
                        <p className="text-xs text-blue-100 truncate">{selectedUser.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="purple" size="sm" className="flex-shrink-0">
                          <Shield size={10} />
                          Roles: {selectedUser.roles.length}
                        </Badge>
                        <Badge variant="green" size="sm" className="flex-shrink-0">
                          <CheckCircle size={10} />
                          Permisos: {selectedUser.directModules.length}
                        </Badge>
                      </div>
                      <button
                        onClick={() => toggleExpanded(selectedUser.id)}
                        className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                        title={isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-white" />
                        ) : (
                          <ChevronDown size={16} className="text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(selectedUser.id)}
                        className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                        title="Quitar usuario"
                      >
                        <XCircle size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Contenido del Accordion - Roles y Permisos */}
                  {isExpanded && (
                    <>
                      {/* Roles Actuales */}
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Shield size={14} className="text-purple-600" />
                          <h5 className="text-xs font-semibold text-gray-700">Roles</h5>
                          <Badge variant="gray" size="sm" className="ml-auto">
                            {selectedUser.roles.length}
                          </Badge>
                        </div>
                        {selectedUser.roles.length > 0 ? (
                          <div className="space-y-1.5">
                            {selectedUser.roles.map((role) => (
                              <div key={role.id} className="bg-purple-50 border border-purple-200 rounded p-2">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Shield size={12} className="text-purple-600" />
                                  <p className="text-xs font-medium text-gray-900">{role.name}</p>
                                </div>
                                <div className="flex flex-wrap gap-1">
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
                        ) : (
                          <p className="text-xs text-gray-500 italic">Sin roles asignados</p>
                        )}
                      </div>

                      {/* Permisos Directos */}
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <h5 className="text-xs font-semibold text-gray-700">Permisos Directos</h5>
                          <Badge variant="gray" size="sm" className="ml-auto">
                            {selectedUser.directModules.length}
                          </Badge>
                        </div>
                        {selectedUser.directModules.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedUser.directModules.map((module, index) => (
                              <PermissionBadge
                                key={index}
                                moduleName={module.name}
                                moduleKey={module.key}
                                permissions={module.permissions}
                                color={module.color}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic">Sin permisos directos asignados</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Text */}
        {selectedUsers.length === 0 && !searchQuery && (
          <div className="text-center py-6 text-gray-500">
            <User size={28} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Busca usuarios para asignarlos a este rol</p>
          </div>
        )}
      </div>
    </Modal>
  );
}