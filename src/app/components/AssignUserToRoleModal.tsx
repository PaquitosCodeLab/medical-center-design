import { useState } from 'react';
import { Modal, ModalButton } from './Modal';
import { Search, User, Shield, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
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
          <ModalButton onClick={handleAssign} variant="primary">
            Asignar {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-3">
        {/* Info del Rol */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-blue-600" />
            <p className="text-[10px] text-blue-900">
              Asignando al rol: <span className="font-semibold">{roleName}</span>
            </p>
          </div>
        </div>

        {/* Búsqueda de Usuario */}
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">
            Buscar Usuario
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o correo electrónico..."
              className="w-full pl-8 pr-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
            />
          </div>
        </div>

        {/* Lista de Resultados de Búsqueda */}
        {searchQuery && (
          <div className="border border-gray-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.status === 'Confirmado' ? 'green' : 'yellow'} size="sm">
                      {user.status}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-center text-[10px] text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        )}

        {/* Lista de Usuarios Seleccionados */}
        {selectedUsers.length > 0 && (
          <div className="space-y-2">
            <label className="block text-[10px] font-medium text-gray-600">
              Usuarios Seleccionados ({selectedUsers.length})
            </label>
            {selectedUsers.map((selectedUser) => {
              const isExpanded = expandedUsers.has(selectedUser.id);
              return (
                <div key={selectedUser.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all">
                  {/* User Card Header */}
                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                      {getInitials(selectedUser.firstName, selectedUser.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{selectedUser.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                        {selectedUser.roles.length} roles
                      </span>
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                        {selectedUser.directModules.length} permisos
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpanded(selectedUser.id)}
                      className="p-1 hover:bg-blue-200/50 rounded-lg transition-colors flex-shrink-0"
                      title={isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveUser(selectedUser.id)}
                      className="p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Quitar usuario"
                    >
                      <X size={14} className="text-gray-400 hover:text-red-600" />
                    </button>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="bg-white divide-y divide-gray-100">
                      {/* Roles */}
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="p-0.5 bg-blue-100 rounded">
                            <Shield size={10} className="text-blue-600" />
                          </div>
                          <h5 className="text-[10px] font-semibold text-gray-700">Roles</h5>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                            {selectedUser.roles.length}
                          </span>
                        </div>
                        {selectedUser.roles.length > 0 ? (
                          <div className="space-y-1">
                            {selectedUser.roles.map((role) => (
                              <div key={role.id} className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Shield size={10} className="text-blue-600" />
                                  <p className="text-[10px] font-medium text-gray-900">{role.name}</p>
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
                          <p className="text-[10px] text-gray-500 italic">Sin roles asignados</p>
                        )}
                      </div>

                      {/* Permisos Directos */}
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="p-0.5 bg-blue-100 rounded">
                            <CheckCircle size={10} className="text-blue-600" />
                          </div>
                          <h5 className="text-[10px] font-semibold text-gray-700">Permisos Directos</h5>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                            {selectedUser.directModules.length}
                          </span>
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
                          <p className="text-[10px] text-gray-500 italic">Sin permisos directos asignados</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Text */}
        {selectedUsers.length === 0 && !searchQuery && (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded-xl">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
              <User size={18} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-500">Busca usuarios para asignarlos a este rol</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
