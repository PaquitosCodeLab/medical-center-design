import { useState, useEffect, useRef } from 'react';
import { Modal, ModalButton } from './Modal';
import { Search, X, Check, ChevronDown, Shield } from 'lucide-react';
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSave: (userData: UserData) => void;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  roles: Role[];
  directModules: Module[];
}

const availableRoles: Role[] = [
  { id: 1, name: 'Admin', description: 'Acceso completo al sistema', modules: [
    { name: 'Usuarios', key: 'user', color: 'blue', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: true }, { key: 'assignRole', label: 'Asignar Rol', granted: true }, { key: 'assignPermission', label: 'Asignar Permiso', granted: true }] },
    { name: 'Roles', key: 'role', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: true }, { key: 'assignUser', label: 'Asignar Usuario', granted: true }, { key: 'assignPermission', label: 'Asignar Permiso', granted: true }] },
    { name: 'Personas', key: 'person', color: 'green', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: true }] },
    { name: 'Citas', key: 'appointments', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: true }] },
  ] },
  { id: 2, name: 'Doctor', description: 'Acceso a funciones médicas', modules: [
    { name: 'Personas', key: 'person', color: 'green', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: false }] },
    { name: 'Citas', key: 'appointments', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: false }] },
  ] },
  { id: 3, name: 'Recepcionista', description: 'Gestión de citas y pacientes', modules: [
    { name: 'Personas', key: 'person', color: 'green', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }] },
    { name: 'Citas', key: 'appointments', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: true }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: true }, { key: 'update', label: 'Editar', granted: true }, { key: 'delete', label: 'Eliminar', granted: false }] },
  ] },
  { id: 4, name: 'Usuario', description: 'Acceso básico al sistema', modules: [
    { name: 'Personas', key: 'person', color: 'green', permissions: [{ key: 'read', label: 'Lectura', granted: true, children: [{ key: 'list', label: 'Listar', granted: false }, { key: 'get', label: 'Detalle', granted: true }] }, { key: 'create', label: 'Crear', granted: false }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }] },
  ] },
];

const availableModules: Module[] = [
  { name: 'Usuarios', key: 'user', color: 'blue', permissions: [{ key: 'read', label: 'Lectura', granted: false, children: [{ key: 'list', label: 'Listar', granted: false }, { key: 'get', label: 'Detalle', granted: false }] }, { key: 'create', label: 'Crear', granted: false }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }, { key: 'assignRole', label: 'Asignar Rol', granted: false }, { key: 'assignPermission', label: 'Asignar Permiso', granted: false }] },
  { name: 'Roles', key: 'role', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: false, children: [{ key: 'list', label: 'Listar', granted: false }, { key: 'get', label: 'Detalle', granted: false }] }, { key: 'create', label: 'Crear', granted: false }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }, { key: 'assignUser', label: 'Asignar Usuario', granted: false }, { key: 'assignPermission', label: 'Asignar Permiso', granted: false }] },
  { name: 'Personas', key: 'person', color: 'green', permissions: [{ key: 'read', label: 'Lectura', granted: false, children: [{ key: 'list', label: 'Listar', granted: false }, { key: 'get', label: 'Detalle', granted: false }] }, { key: 'create', label: 'Crear', granted: false }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }] },
  { name: 'Citas', key: 'appointments', color: 'purple', permissions: [{ key: 'read', label: 'Lectura', granted: false, children: [{ key: 'list', label: 'Listar', granted: false }, { key: 'get', label: 'Detalle', granted: false }] }, { key: 'create', label: 'Crear', granted: false }, { key: 'update', label: 'Editar', granted: false }, { key: 'delete', label: 'Eliminar', granted: false }] },
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

export function EditUserModal({ isOpen, onClose, userData, onSave }: EditUserModalProps) {
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [userType, setUserType] = useState(userData.userType);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(userData.roles);
  const [directModules, setDirectModules] = useState<Module[]>(userData.directModules);
  const [expandedModules, setExpandedModules] = useState<string[]>(userData.directModules.map(m => m.key));
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFirstName(userData.firstName); setLastName(userData.lastName); setEmail(userData.email); setUserType(userData.userType);
    setSelectedRoles(userData.roles);
    const cleaned = userData.directModules.map(m => ({ ...m, permissions: m.permissions.filter(p => p.key !== 'full') }));
    setDirectModules(cleaned); setExpandedModules(cleaned.map(m => m.key));
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) setIsRoleDropdownOpen(false);
    };
    if (isRoleDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRoleDropdownOpen]);

  const handleSave = () => { onSave({ firstName, lastName, email, userType, roles: selectedRoles, directModules }); onClose(); };
  const toggleRole = (role: Role) => { setSelectedRoles(prev => prev.find(r => r.id === role.id) ? prev.filter(r => r.id !== role.id) : [...prev, role]); };
  const toggleModuleExpand = (key: string) => setExpandedModules(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const toggleModulePermission = (moduleKey: string, permissionKey: string) => {
    setDirectModules(directModules.map(module => {
      if (module.key !== moduleKey) return module;
      return { ...module, permissions: module.permissions.map(permission => {
        if (permission.key === permissionKey) {
          const ng = !permission.granted;
          if (permission.children) return { ...permission, granted: ng, children: permission.children.map(c => ({ ...c, granted: ng })) };
          return { ...permission, granted: ng };
        }
        if (permission.children) {
          const ci = permission.children.findIndex(c => c.key === permissionKey);
          if (ci !== -1) { const nc = permission.children.map(c => c.key === permissionKey ? { ...c, granted: !c.granted } : c); return { ...permission, granted: nc.some(c => c.granted), children: nc }; }
        }
        return permission;
      }) };
    }));
  };

  const toggleModuleSelection = (moduleKey: string) => {
    const existing = directModules.find(m => m.key === moduleKey);
    if (existing) {
      if (isModuleFullyGranted(existing)) { setDirectModules(directModules.filter(m => m.key !== moduleKey)); }
      else { setDirectModules(directModules.map(m => m.key === moduleKey ? setAllPermissions(m, true) : m)); }
    } else {
      const template = availableModules.find(m => m.key === moduleKey);
      if (template) { setDirectModules([...directModules, setAllPermissions({ ...template }, true)]); if (!expandedModules.includes(moduleKey)) setExpandedModules([...expandedModules, moduleKey]); }
    }
  };

  const filteredRoles = availableRoles.filter(r => r.name.toLowerCase().includes(roleSearchQuery.toLowerCase()));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario" maxWidth="2xl" footer={
      <><ModalButton onClick={onClose} variant="secondary">Cancelar</ModalButton><ModalButton onClick={handleSave} variant="primary">Guardar Cambios</ModalButton></>
    }>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Nombre</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" placeholder="Nombre" /></div>
          <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Apellido</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" placeholder="Apellido" /></div>
          <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Tipo</label><select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all bg-white"><option>Usuario</option><option>Administrador</option><option>Desarrollador</option></select></div>
        </div>
        <div><label className="block text-[10px] font-medium text-gray-600 mb-1">Correo Electrónico</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" placeholder="correo@ejemplo.com" /></div>

        <div className="grid grid-cols-2 gap-4">
          {/* Roles */}
          <div>
            <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Asignar Roles</label>
            <div className="relative" ref={roleDropdownRef}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input type="text" value={roleSearchQuery} onChange={(e) => setRoleSearchQuery(e.target.value)} onFocus={() => setIsRoleDropdownOpen(true)} className="w-full pl-7 pr-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all" placeholder="Buscar roles..." />
              {isRoleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {filteredRoles.length > 0 ? filteredRoles.map(role => {
                    const isSel = selectedRoles.find(r => r.id === role.id);
                    return (<button key={role.id} onClick={() => toggleRole(role)} className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-start gap-2 border-b border-gray-100 last:border-b-0">
                      <div className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 rounded border ${isSel ? 'bg-blue-600 border-blue-600' : 'border-gray-300'} flex items-center justify-center`}>{isSel && <Check size={9} className="text-white" />}</div>
                      <div className="flex-1 min-w-0"><div className="text-[10px] font-medium text-gray-900">{role.name}</div><div className="text-[10px] text-gray-500">{role.description}</div></div>
                    </button>);
                  }) : <div className="px-3 py-2 text-[10px] text-gray-500 text-center">No se encontraron roles</div>}
                </div>
              )}
            </div>
            {selectedRoles.length > 0 && (
              <div className="mt-2 space-y-2">
                {selectedRoles.map(role => (
                  <div key={role.id} className="border border-gray-200 rounded-xl p-2.5 bg-gray-50">
                    <div className="flex items-center justify-between mb-1.5"><span className="text-[10px] font-semibold text-gray-900">{role.name}</span><button onClick={() => toggleRole(role)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5"><X size={12} /></button></div>
                    <div className="flex flex-wrap gap-1.5">{role.modules.map((module, i) => (<PermissionBadge key={i} moduleName={module.name} moduleKey={module.key} permissions={module.permissions} color={module.color} />))}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permisos Directos */}
          <div>
            <label className="block text-[10px] font-medium text-gray-600 mb-1.5">Permisos Directos</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {availableModules.map((module) => {
                const selected = directModules.find(m => m.key === module.key);
                const displayModule = selected || module;
                const fullyGranted = selected ? isModuleFullyGranted(selected) : false;
                const partiallyGranted = selected ? isModulePartiallyGranted(selected) : false;
                return (
                  <div key={module.key} className="border-b border-gray-200 last:border-b-0">
                    <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <IndeterminateCheckbox checked={fullyGranted} indeterminate={partiallyGranted} onChange={() => toggleModuleSelection(module.key)} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500" />
                        <div className="flex items-center gap-1.5">
                          <div className="p-0.5 bg-blue-100 rounded"><Shield size={10} className="text-blue-600" /></div>
                          <span className="text-[10px] font-semibold text-gray-900">{module.name}</span>
                        </div>
                      </label>
                      {selected && <button onClick={() => toggleModuleExpand(module.key)} className="p-0.5 hover:bg-gray-200 rounded"><ChevronDown size={13} className={`text-gray-500 transition-transform ${expandedModules.includes(module.key) ? 'rotate-180' : ''}`} /></button>}
                    </div>
                    {selected && expandedModules.includes(module.key) && (
                      <div className="bg-white px-3 py-1.5 space-y-0.5">
                        {displayModule.permissions.filter(p => !p.children || p.children.length === 0).map(perm => (
                          <label key={perm.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded-lg transition-colors">
                            <input type="checkbox" checked={perm.granted} onChange={() => toggleModulePermission(module.key, perm.key)} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer" />
                            <span className="text-[10px] text-gray-700">{perm.label}</span>
                          </label>
                        ))}
                        {displayModule.permissions.filter(p => p.children && p.children.length > 0).map(perm => {
                          const allC = perm.children!.every(c => c.granted);
                          const someC = perm.children!.some(c => c.granted);
                          return (
                            <div key={perm.key} className="space-y-0.5">
                              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-0.5 rounded-lg transition-colors">
                                <IndeterminateCheckbox checked={allC} indeterminate={someC && !allC} onChange={() => toggleModulePermission(module.key, perm.key)} className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 cursor-pointer" />
                                <span className="text-[10px] text-gray-700 font-medium">{perm.label}</span>
                              </label>
                              <div className="ml-5 pl-2.5 border-l border-gray-200 space-y-0.5">
                                {perm.children!.map(child => (
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
        </div>
      </div>
    </Modal>
  );
}
