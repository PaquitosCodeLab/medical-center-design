import { useState, useEffect, useRef } from 'react';
import { Modal, ModalButton } from './Modal';
import { ChevronDown, Shield, Layers } from 'lucide-react';

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

export interface RoleData {
  name: string;
  description: string;
  color: string;
  modules: Module[];
}

// =============================================
// Edit Role Info Modal (name + description)
// =============================================

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: RoleData) => void;
  roleData: RoleData;
}

export function EditRoleModal({ isOpen, onClose, onSave, roleData }: EditRoleModalProps) {
  const [name, setName] = useState(roleData.name);
  const [description, setDescription] = useState(roleData.description);

  useEffect(() => {
    setName(roleData.name);
    setDescription(roleData.description);
  }, [roleData]);

  const handleSave = () => {
    onSave({ ...roleData, name, description });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Rol"
      maxWidth="md"
      footer={
        <>
          <ModalButton onClick={onClose} variant="secondary">Cancelar</ModalButton>
          <ModalButton onClick={handleSave} variant="primary">Guardar</ModalButton>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre del Rol</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all"
            placeholder="Ej: Administrador"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all resize-none"
            placeholder="Descripción del rol..."
            rows={2}
          />
        </div>
      </div>
    </Modal>
  );
}

// =============================================
// Edit Permissions Modal (modules + permissions)
// =============================================

const availableModules: Module[] = [
  {
    name: 'Usuarios', key: 'user', color: 'blue',
    permissions: [
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
    name: 'Roles', key: 'role', color: 'purple',
    permissions: [
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
    name: 'Personas', key: 'person', color: 'green',
    permissions: [
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
    name: 'Citas', key: 'appointments', color: 'purple',
    permissions: [
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

function setAllPermissions(module: Module, granted: boolean): Module {
  return { ...module, permissions: module.permissions.map(p => ({ ...p, granted, children: p.children?.map(c => ({ ...c, granted })) })) };
}

function isModuleFullyGranted(module: Module): boolean {
  return module.permissions.every(p => { if (p.children) return p.children.every(c => c.granted); return p.granted; });
}

function isModulePartiallyGranted(module: Module): boolean {
  const hasAny = module.permissions.some(p => { if (p.children) return p.children.some(c => c.granted); return p.granted; });
  return hasAny && !isModuleFullyGranted(module);
}

function IndeterminateCheckbox({ checked, indeterminate, onChange, className }: { checked: boolean; indeterminate: boolean; onChange: () => void; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <input ref={ref} type="checkbox" checked={checked} onChange={onChange} className={className} />;
}

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modules: Module[]) => void;
  modules: Module[];
}

export function EditPermissionsModal({ isOpen, onClose, onSave, modules: initialModules }: EditPermissionsModalProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    const cleaned = initialModules.map(m => ({ ...m, permissions: m.permissions.filter(p => p.key !== 'full') }));
    setModules(cleaned);
    setExpandedModules(initialModules.map(m => m.key));
  }, [initialModules]);

  const handleSave = () => { onSave(modules); onClose(); };

  const toggleModule = (moduleKey: string) => {
    setExpandedModules(prev => prev.includes(moduleKey) ? prev.filter(k => k !== moduleKey) : [...prev, moduleKey]);
  };

  const toggleModulePermission = (moduleKey: string, permissionKey: string) => {
    setModules(modules.map(module => {
      if (module.key !== moduleKey) return module;
      return { ...module, permissions: module.permissions.map(permission => {
        if (permission.key === permissionKey) {
          const newGranted = !permission.granted;
          if (permission.children) return { ...permission, granted: newGranted, children: permission.children.map(c => ({ ...c, granted: newGranted })) };
          return { ...permission, granted: newGranted };
        }
        if (permission.children) {
          const childIndex = permission.children.findIndex(c => c.key === permissionKey);
          if (childIndex !== -1) {
            const newChildren = permission.children.map(c => c.key === permissionKey ? { ...c, granted: !c.granted } : c);
            return { ...permission, granted: newChildren.some(c => c.granted), children: newChildren };
          }
        }
        return permission;
      }) };
    }));
  };

  const toggleModuleSelection = (moduleKey: string) => {
    const existing = modules.find(m => m.key === moduleKey);
    if (existing) {
      if (isModuleFullyGranted(existing)) {
        setModules(modules.filter(m => m.key !== moduleKey));
      } else {
        setModules(modules.map(m => m.key === moduleKey ? setAllPermissions(m, true) : m));
      }
    } else {
      const template = availableModules.find(m => m.key === moduleKey);
      if (template) {
        setModules([...modules, setAllPermissions({ ...template }, true)]);
        if (!expandedModules.includes(moduleKey)) setExpandedModules([...expandedModules, moduleKey]);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Permisos" maxWidth="2xl" footer={
      <>
        <ModalButton onClick={onClose} variant="secondary">Cancelar</ModalButton>
        <ModalButton onClick={handleSave} variant="primary">Guardar</ModalButton>
      </>
    }>
      <div>
        <div className="border border-gray-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
          {availableModules.map((module) => {
            const selected = modules.find(m => m.key === module.key);
            const displayModule = selected || module;
            const fullyGranted = selected ? isModuleFullyGranted(selected) : false;
            const partiallyGranted = selected ? isModulePartiallyGranted(selected) : false;

            return (
              <div key={module.key} className="border-b border-gray-200 last:border-b-0">
                <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <IndeterminateCheckbox
                      checked={fullyGranted}
                      indeterminate={partiallyGranted}
                      onChange={() => toggleModuleSelection(module.key)}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <div className="p-0.5 bg-blue-100 rounded"><Shield size={10} className="text-blue-600" /></div>
                      <span className="text-[10px] font-semibold text-gray-900">{module.name}</span>
                    </div>
                  </label>
                  {selected && (
                    <button onClick={() => toggleModule(module.key)} className="p-0.5 hover:bg-gray-200 rounded transition-colors">
                      <ChevronDown size={13} className={`text-gray-500 transition-transform ${expandedModules.includes(module.key) ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {selected && expandedModules.includes(module.key) && (
                  <div className="bg-white px-3 py-1.5 space-y-0.5">
                    {displayModule.permissions
                      .filter(p => !p.children || p.children.length === 0)
                      .map(permission => (
                        <label key={permission.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded-lg transition-colors">
                          <input type="checkbox" checked={permission.granted} onChange={() => toggleModulePermission(module.key, permission.key)} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer" />
                          <span className="text-[10px] text-gray-700">{permission.label}</span>
                        </label>
                      ))}
                    {displayModule.permissions
                      .filter(p => p.children && p.children.length > 0)
                      .map(permission => {
                        const allChildren = permission.children!.every(c => c.granted);
                        const someChildren = permission.children!.some(c => c.granted);
                        return (
                          <div key={permission.key} className="space-y-0.5">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded-lg transition-colors">
                              <IndeterminateCheckbox checked={allChildren} indeterminate={someChildren && !allChildren} onChange={() => toggleModulePermission(module.key, permission.key)} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer" />
                              <span className="text-[10px] text-gray-700 font-medium">{permission.label}</span>
                            </label>
                            <div className="ml-5 pl-2.5 border-l border-gray-200 space-y-0.5">
                              {permission.children!.map(child => (
                                <label key={child.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded-lg transition-colors relative">
                                  <div className="absolute -left-2.5 top-1/2 w-2 h-px bg-gray-200"></div>
                                  <input type="checkbox" checked={child.granted} onChange={() => toggleModulePermission(module.key, child.key)} className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer" />
                                  <span className="text-[10px] text-gray-600">{child.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
