import { useState, useEffect } from 'react';
import { Modal, ModalButton } from './Modal';
import { ChevronDown, Check } from 'lucide-react';

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

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: RoleData) => void;
  roleData: RoleData;
}

export interface RoleData {
  name: string;
  description: string;
  color: string;
  modules: Module[];
}

const availableColors = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'purple', label: 'Morado', class: 'bg-purple-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'orange', label: 'Naranja', class: 'bg-orange-500' },
  { value: 'red', label: 'Rojo', class: 'bg-red-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
  { value: 'teal', label: 'Turquesa', class: 'bg-teal-500' }
];

const availableModules: Module[] = [
  {
    name: 'Usuarios',
    key: 'user',
    color: 'blue',
    permissions: [
      { key: 'full', label: 'Completo', granted: false },
      { key: 'read', label: 'Lectura', granted: false, children: [
        { key: 'list', label: 'Listar', granted: false },
        { key: 'get', label: 'Detalle', granted: false }
      ] },
      { key: 'create', label: 'Crear', granted: false },
      { key: 'update', label: 'Editar', granted: false },
      { key: 'delete', label: 'Eliminar', granted: false },
      { key: 'assignRole', label: 'Asignar Rol', granted: false },
      { key: 'assignPermission', label: 'Asignar Permiso', granted: false }
    ]
  },
  {
    name: 'Roles',
    key: 'role',
    color: 'purple',
    permissions: [
      { key: 'full', label: 'Completo', granted: false },
      { key: 'read', label: 'Lectura', granted: false, children: [
        { key: 'list', label: 'Listar', granted: false },
        { key: 'get', label: 'Detalle', granted: false }
      ] },
      { key: 'create', label: 'Crear', granted: false },
      { key: 'update', label: 'Editar', granted: false },
      { key: 'delete', label: 'Eliminar', granted: false },
      { key: 'assignUser', label: 'Asignar Usuario', granted: false },
      { key: 'assignPermission', label: 'Asignar Permiso', granted: false }
    ]
  },
  {
    name: 'Personas',
    key: 'person',
    color: 'green',
    permissions: [
      { key: 'full', label: 'Completo', granted: false },
      { key: 'read', label: 'Lectura', granted: false, children: [
        { key: 'list', label: 'Listar', granted: false },
        { key: 'get', label: 'Detalle', granted: false }
      ] },
      { key: 'create', label: 'Crear', granted: false },
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
      { key: 'read', label: 'Lectura', granted: false, children: [
        { key: 'list', label: 'Listar', granted: false },
        { key: 'get', label: 'Detalle', granted: false }
      ] },
      { key: 'create', label: 'Crear', granted: false },
      { key: 'update', label: 'Editar', granted: false },
      { key: 'delete', label: 'Eliminar', granted: false }
    ]
  }
];

export function EditRoleModal({ isOpen, onClose, onSave, roleData }: EditRoleModalProps) {
  const [name, setName] = useState(roleData.name);
  const [description, setDescription] = useState(roleData.description);
  const [color, setColor] = useState(roleData.color);
  const [modules, setModules] = useState<Module[]>(roleData.modules);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    setName(roleData.name);
    setDescription(roleData.description);
    setColor(roleData.color);
    setModules(roleData.modules);
    setExpandedModules(roleData.modules.map(m => m.key));
  }, [roleData]);

  const handleSave = () => {
    const updatedRoleData: RoleData = {
      name,
      description,
      color,
      modules,
    };
    onSave(updatedRoleData);
    onClose();
  };

  const toggleModule = (moduleKey: string) => {
    if (expandedModules.includes(moduleKey)) {
      setExpandedModules(expandedModules.filter(k => k !== moduleKey));
    } else {
      setExpandedModules([...expandedModules, moduleKey]);
    }
  };

  const toggleModulePermission = (moduleKey: string, permissionKey: string) => {
    setModules(modules.map(module => {
      if (module.key === moduleKey) {
        return {
          ...module,
          permissions: module.permissions.map(permission => {
            if (permission.key === permissionKey) {
              const newGranted = !permission.granted;
              // Si tiene hijos, también cambiarlos
              if (permission.children) {
                return {
                  ...permission,
                  granted: newGranted,
                  children: permission.children.map(child => ({
                    ...child,
                    granted: newGranted
                  }))
                };
              }
              return { ...permission, granted: newGranted };
            }
            // Si es un padre y se está modificando un hijo, actualizar el padre
            if (permission.children) {
              const childIndex = permission.children.findIndex(c => c.key === permissionKey);
              if (childIndex !== -1) {
                const newChildren = permission.children.map(child =>
                  child.key === permissionKey ? { ...child, granted: !child.granted } : child
                );
                const allChildrenGranted = newChildren.every(c => c.granted);
                const anyChildGranted = newChildren.some(c => c.granted);
                return {
                  ...permission,
                  granted: anyChildGranted,
                  children: newChildren
                };
              }
            }
            return permission;
          })
        };
      }
      return module;
    }));
  };

  const toggleModuleSelection = (moduleKey: string) => {
    const moduleExists = modules.find(m => m.key === moduleKey);
    if (moduleExists) {
      // Remover módulo
      setModules(modules.filter(m => m.key !== moduleKey));
    } else {
      // Agregar módulo
      const moduleTemplate = availableModules.find(m => m.key === moduleKey);
      if (moduleTemplate) {
        setModules([...modules, { ...moduleTemplate }]);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Rol"
      maxWidth="2xl"
      footer={
        <>
          <ModalButton onClick={onClose} variant="secondary">
            Cancelar
          </ModalButton>
          <ModalButton onClick={handleSave} variant="primary">
            Guardar Cambios
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nombre del Rol
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all"
              placeholder="Ej: Administrador"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all bg-white"
            >
              {availableColors.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all resize-none"
            placeholder="Descripción del rol..."
            rows={2}
          />
        </div>

        {/* Modules and Permissions */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Módulos y Permisos
          </label>
          <div className="border border-gray-200 rounded-md overflow-hidden max-h-80 overflow-y-auto">
            {availableModules.map((module) => {
              const isSelected = modules.find(m => m.key === module.key);
              const selectedModule = isSelected || module;
              
              return (
                <div key={module.key} className="border-b border-gray-200 last:border-b-0">
                  {/* Module Header */}
                  <div className="bg-gray-50 px-2.5 py-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleModuleSelection(module.key)}
                        className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500/30"
                      />
                      <span className="text-xs font-medium text-gray-900">{module.name}</span>
                    </label>
                    {isSelected && (
                      <button
                        onClick={() => toggleModule(module.key)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <ChevronDown
                          size={14}
                          className={`text-gray-600 transition-transform ${
                            expandedModules.includes(module.key) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Permissions */}
                  {isSelected && expandedModules.includes(module.key) && (
                    <div className="bg-white px-4 py-2 space-y-1">
                      {selectedModule.permissions
                        .filter(p => !p.children || p.children.length === 0)
                        .map(permission => (
                          <label
                            key={permission.key}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={permission.granted}
                              onChange={() => toggleModulePermission(module.key, permission.key)}
                              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-700">{permission.label}</span>
                          </label>
                        ))}

                      {/* Parent permissions with children */}
                      {selectedModule.permissions
                        .filter(p => p.children && p.children.length > 0)
                        .map(permission => (
                          <div key={permission.key} className="space-y-0.5">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={permission.granted}
                                onChange={() => toggleModulePermission(module.key, permission.key)}
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-xs text-gray-700 font-medium">{permission.label}</span>
                            </label>
                            {permission.children && (
                              <div className="ml-6 pl-2 border-l border-gray-300 space-y-0.5">
                                {permission.children.map(child => (
                                  <label
                                    key={child.key}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={child.granted}
                                      onChange={() => toggleModulePermission(module.key, child.key)}
                                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-600">{child.label}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
