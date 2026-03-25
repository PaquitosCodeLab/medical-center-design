import { useState, useEffect, useRef } from 'react';
import { Modal, ModalButton } from './Modal';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { PermissionBadge } from './PermissionBadge';

interface Module {
  name: string;
  key: string;
  color: string;
  permissions: {
    key: string;
    label: string;
    granted: boolean;
    children?: { key: string; label: string; granted: boolean }[];
  }[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  modules: Module[];
}

interface Permission {
  id: string;
  name: string;
  category: string;
  parent?: string;
  children?: string[];
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: NewUserData) => void;
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  roles: Role[];
  permissions: string[];
}

const availableRoles: Role[] = [
  { 
    id: 1, 
    name: 'Admin', 
    description: 'Acceso completo al sistema', 
    modules: [
      { 
        name: 'Usuarios', 
        key: 'user', 
        color: 'blue', 
        permissions: [
          { key: 'full', label: 'Completo', granted: true },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: true }
        ]
      },
      { 
        name: 'Roles', 
        key: 'role', 
        color: 'purple', 
        permissions: [
          { key: 'full', label: 'Completo', granted: true },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: true }
        ]
      },
      { 
        name: 'Personas', 
        key: 'person', 
        color: 'green', 
        permissions: [
          { key: 'full', label: 'Completo', granted: true },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: true }
        ]
      },
      { 
        name: 'Citas', 
        key: 'appointments', 
        color: 'purple', 
        permissions: [
          { key: 'full', label: 'Completo', granted: true },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: true }
        ]
      }
    ]
  },
  { 
    id: 2, 
    name: 'Doctor', 
    description: 'Acceso a funciones médicas', 
    modules: [
      { 
        name: 'Personas', 
        key: 'person', 
        color: 'green', 
        permissions: [
          { key: 'full', label: 'Completo', granted: false },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: false }
        ]
      },
      { 
        name: 'Citas', 
        key: 'appointments', 
        color: 'purple', 
        permissions: [
          { key: 'full', label: 'Completo', granted: false },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: false }
        ]
      }
    ]
  },
  { 
    id: 3, 
    name: 'Recepcionista', 
    description: 'Gestión de citas y pacientes', 
    modules: [
      { 
        name: 'Personas', 
        key: 'person', 
        color: 'green', 
        permissions: [
          { key: 'full', label: 'Completo', granted: false },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: false },
          { key: 'delete', label: 'Eliminar', granted: false }
        ]
      },
      { 
        name: 'Citas', 
        key: 'appointments', 
        color: 'purple', 
        permissions: [
          { key: 'full', label: 'Completo', granted: false },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: true },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: true },
          { key: 'update', label: 'Editar', granted: true },
          { key: 'delete', label: 'Eliminar', granted: false }
        ]
      }
    ]
  },
  { 
    id: 4, 
    name: 'Usuario', 
    description: 'Acceso básico al sistema', 
    modules: [
      { 
        name: 'Personas', 
        key: 'person', 
        color: 'green', 
        permissions: [
          { key: 'full', label: 'Completo', granted: false },
          { key: 'read', label: 'Lectura', granted: true, children: [
            { key: 'list', label: 'Listar', granted: false },
            { key: 'get', label: 'Detalle', granted: true }
          ] },
          { key: 'create', label: 'Crear', granted: false },
          { key: 'update', label: 'Editar', granted: false },
          { key: 'delete', label: 'Eliminar', granted: false }
        ]
      }
    ]
  }
];

const availablePermissions: Permission[] = [
  // Usuarios
  { id: 'users_read', name: 'Lectura', category: 'Usuarios', children: ['users_list', 'users_get'] },
  { id: 'users_list', name: 'Listar', category: 'Usuarios', parent: 'users_read' },
  { id: 'users_get', name: 'Detalle', category: 'Usuarios', parent: 'users_read' },
  { id: 'users_create', name: 'Crear', category: 'Usuarios' },
  { id: 'users_update', name: 'Editar', category: 'Usuarios' },
  { id: 'users_delete', name: 'Eliminar', category: 'Usuarios' },
  { id: 'users_assignRole', name: 'Asignar Rol', category: 'Usuarios' },
  { id: 'users_assignPermission', name: 'Asignar Permiso', category: 'Usuarios' },
  
  // Citas
  { id: 'appointments_read', name: 'Lectura', category: 'Citas', children: ['appointments_list', 'appointments_get'] },
  { id: 'appointments_list', name: 'Listar', category: 'Citas', parent: 'appointments_read' },
  { id: 'appointments_get', name: 'Detalle', category: 'Citas', parent: 'appointments_read' },
  { id: 'appointments_create', name: 'Crear', category: 'Citas' },
  { id: 'appointments_update', name: 'Editar', category: 'Citas' },
  { id: 'appointments_delete', name: 'Eliminar', category: 'Citas' },
  
  // Pacientes
  { id: 'patients_read', name: 'Lectura', category: 'Pacientes', children: ['patients_list', 'patients_get'] },
  { id: 'patients_list', name: 'Listar', category: 'Pacientes', parent: 'patients_read' },
  { id: 'patients_get', name: 'Detalle', category: 'Pacientes', parent: 'patients_read' },
  { id: 'patients_create', name: 'Crear', category: 'Pacientes' },
  { id: 'patients_update', name: 'Editar', category: 'Pacientes' },
  { id: 'patients_delete', name: 'Eliminar', category: 'Pacientes' },
  
  // Roles
  { id: 'roles_read', name: 'Lectura', category: 'Roles', children: ['roles_list', 'roles_get'] },
  { id: 'roles_list', name: 'Listar', category: 'Roles', parent: 'roles_read' },
  { id: 'roles_get', name: 'Detalle', category: 'Roles', parent: 'roles_read' },
  { id: 'roles_create', name: 'Crear', category: 'Roles' },
  { id: 'roles_update', name: 'Editar', category: 'Roles' },
  { id: 'roles_delete', name: 'Eliminar', category: 'Roles' },
  { id: 'roles_assignUser', name: 'Asignar Usuario', category: 'Roles' },
  { id: 'roles_assignPermission', name: 'Asignar Permiso', category: 'Roles' },
  
  // Reportes
  { id: 'reports_read', name: 'Lectura', category: 'Reportes', children: ['reports_list', 'reports_get'] },
  { id: 'reports_list', name: 'Listar', category: 'Reportes', parent: 'reports_read' },
  { id: 'reports_get', name: 'Detalle', category: 'Reportes', parent: 'reports_read' },
  { id: 'reports_create', name: 'Generar', category: 'Reportes' },
  
  // Configuración
  { id: 'settings_read', name: 'Lectura', category: 'Configuración', children: ['settings_list', 'settings_get'] },
  { id: 'settings_list', name: 'Listar', category: 'Configuración', parent: 'settings_read' },
  { id: 'settings_get', name: 'Detalle', category: 'Configuración', parent: 'settings_read' },
  { id: 'settings_update', name: 'Editar', category: 'Configuración' },
];

export function CreateUserModal({ isOpen, onClose, onCreate }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Usuario');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Usuarios', 'Citas']);
  
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoleDropdownOpen]);

  const handleCreate = () => {
    const userData: NewUserData = {
      firstName,
      lastName,
      email,
      userType,
      roles: selectedRoles,
      permissions: selectedPermissions,
    };
    onCreate(userData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setUserType('Usuario');
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setRoleSearchQuery('');
    setIsRoleDropdownOpen(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const toggleRole = (role: Role) => {
    if (selectedRoles.find(r => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter(r => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const togglePermission = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    if (!permission) return;

    let newPermissions = [...selectedPermissions];

    if (newPermissions.includes(permissionId)) {
      // Deseleccionar este permiso
      newPermissions = newPermissions.filter(p => p !== permissionId);
      
      // Si es un permiso padre, deseleccionar también sus hijos
      if (permission.children) {
        permission.children.forEach(childId => {
          newPermissions = newPermissions.filter(p => p !== childId);
        });
      }
      
      // Si es un permiso hijo, verificar si el padre debe deseleccionarse
      if (permission.parent) {
        const parent = availablePermissions.find(p => p.id === permission.parent);
        if (parent && parent.children) {
          const anyChildSelected = parent.children.some(childId => 
            newPermissions.includes(childId) && childId !== permissionId
          );
          if (!anyChildSelected) {
            newPermissions = newPermissions.filter(p => p !== permission.parent);
          }
        }
      }
    } else {
      // Seleccionar este permiso
      newPermissions.push(permissionId);
      
      // Si es un permiso padre, seleccionar también sus hijos
      if (permission.children) {
        permission.children.forEach(childId => {
          if (!newPermissions.includes(childId)) {
            newPermissions.push(childId);
          }
        });
      }
      
      // Si es un permiso hijo, seleccionar también el padre
      if (permission.parent && !newPermissions.includes(permission.parent)) {
        newPermissions.push(permission.parent);
      }
    }

    setSelectedPermissions(newPermissions);
  };

  const isPermissionFullySelected = (permission: Permission) => {
    if (!permission.children) return selectedPermissions.includes(permission.id);
    return selectedPermissions.includes(permission.id) && 
           permission.children.every(childId => selectedPermissions.includes(childId));
  };

  const isPermissionPartiallySelected = (permission: Permission) => {
    if (!permission.children) return false;
    const someChildSelected = permission.children.some(childId => selectedPermissions.includes(childId));
    const allChildrenSelected = permission.children.every(childId => selectedPermissions.includes(childId));
    return someChildSelected && !allChildrenSelected;
  };

  const toggleCategoryPermissions = (category: string) => {
    const categoryPermissions = permissionsByCategory[category].map(p => p.id);
    const allSelected = categoryPermissions.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Deseleccionar todos los permisos de la categoría
      setSelectedPermissions(selectedPermissions.filter(p => !categoryPermissions.includes(p)));
    } else {
      // Seleccionar todos los permisos de la categoría
      const newPermissions = [...selectedPermissions];
      categoryPermissions.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      setSelectedPermissions(newPermissions);
    }
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = permissionsByCategory[category]?.map(p => p.id) || [];
    return categoryPermissions.length > 0 && categoryPermissions.every(id => selectedPermissions.includes(id));
  };

  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = permissionsByCategory[category]?.map(p => p.id) || [];
    return categoryPermissions.some(id => selectedPermissions.includes(id)) && !isCategoryFullySelected(category);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const filteredRoles = availableRoles.filter(role =>
    role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo"
      maxWidth="2xl"
      footer={
        <>
          <ModalButton onClick={handleClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton onClick={handleCreate} variant="primary">
            Crear Usuario
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Basic Information - 3 columns */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
              placeholder="Nombre"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Apellido
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
              placeholder="Apellido"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tipo de Usuario
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all bg-white"
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
              <option value="Desarrollador">Desarrollador</option>
            </select>
          </div>
        </div>

        {/* Email - Full width */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
            placeholder="correo@ejemplo.com"
          />
        </div>

        {/* Roles and Permissions in 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Roles Section */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Asignar Roles
            </label>

            {/* Role Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  type="text"
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  onFocus={() => setIsRoleDropdownOpen(true)}
                  className="w-full pl-7 pr-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs transition-all"
                  placeholder="Buscar roles..."
                />
              </div>

              {isRoleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto" ref={roleDropdownRef}>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map(role => {
                      const isSelected = selectedRoles.find(r => r.id === role.id);
                      return (
                        <button
                          key={role.id}
                          onClick={() => toggleRole(role)}
                          className="w-full px-2 py-1 text-left hover:bg-gray-50 flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className={`flex-shrink-0 w-3 h-3 mt-0.5 rounded border ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {isSelected && <Check size={9} className="text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{role.name}</div>
                            <div className="text-[10px] text-gray-500 truncate">{role.description}</div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-2 py-2 text-xs text-gray-500 text-center">
                      No se encontraron roles
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Roles with PermissionBadge */}
            {selectedRoles.length > 0 && (
              <div className="mt-2 space-y-2">
                {selectedRoles.map(role => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-900">{role.name}</span>
                      <button
                        onClick={() => toggleRole(role)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
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
            )}
          </div>

          {/* Permissions Section */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Seleccionar Permisos
            </label>
            <div className="border border-gray-200 rounded overflow-hidden max-h-52 overflow-y-auto">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-2 py-1 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-medium text-gray-700 transition-colors"
                  >
                    <span>{category}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${
                        expandedCategories.includes(category) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedCategories.includes(category) && (
                    <div className="bg-white">
                      {/* Select All checkbox for category */}
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 border-b border-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={isCategoryFullySelected(category)}
                          ref={(el) => {
                            if (el) {
                              el.indeterminate = isCategoryPartiallySelected(category);
                            }
                          }}
                          onChange={() => toggleCategoryPermissions(category)}
                          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-gray-900">Seleccionar todos</span>
                      </label>
                      
                      {/* Individual permissions with hierarchical indentation */}
                      <div className="pl-3 pr-2 py-1 space-y-0.5">
                        {permissions
                          .filter(permission => !permission.parent) // Only show top-level permissions
                          .map(permission => (
                            <div key={permission.id} className="space-y-0.5">
                              {/* Parent Permission */}
                              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors">
                                <input
                                  type="checkbox"
                                  checked={isPermissionFullySelected(permission)}
                                  ref={(el) => {
                                    if (el && permission.children) {
                                      el.indeterminate = isPermissionPartiallySelected(permission);
                                    }
                                  }}
                                  onChange={() => togglePermission(permission.id)}
                                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-xs text-gray-900 font-medium">{permission.name}</span>
                              </label>
                              
                              {/* Child Permissions (if any) */}
                              {permission.children && (
                                <div className="ml-2 pl-2.5 border-l border-gray-300 space-y-0.5">
                                  {permission.children.map(childId => {
                                    const childPermission = availablePermissions.find(p => p.id === childId);
                                    if (!childPermission) return null;
                                    return (
                                      <label
                                        key={childId}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors relative"
                                      >
                                        <div className="absolute -left-2.5 top-1/2 w-2 h-px bg-gray-300"></div>
                                        <input
                                          type="checkbox"
                                          checked={selectedPermissions.includes(childId)}
                                          onChange={() => togglePermission(childId)}
                                          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-[10px] text-gray-600">{childPermission.name}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}