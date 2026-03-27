import { Shield, Users, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useHeader } from '../components/HeaderContext';
import { useNavigate } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { PermissionBadge } from '../components/PermissionBadge';
import { CreateRoleModal, type NewRoleData } from '../components/CreateRoleModal';

type ViewMode = 'cards' | 'table' | 'list';

export function Roles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [userCountFilter, setUserCountFilter] = useState('all');
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  useHeader({
    title: 'Roles',
    subtitle: 'Gestión de roles y permisos',
    actions: (
      <button onClick={() => setIsCreateRoleModalOpen(true)} className="p-1 text-white" title="Nuevo Rol">
        <Plus size={15} />
      </button>
    ),
  });
  const [morePermsPopover, setMorePermsPopover] = useState<number | null>(null);

  useEffect(() => {
    const handleClick = () => setMorePermsPopover(null);
    if (morePermsPopover !== null) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [morePermsPopover]);

  const roles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Acceso completo al sistema',
      users: 3,
      color: 'red',
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
      name: 'Doctor',
      description: 'Acceso a funciones médicas',
      users: 18,
      color: 'purple',
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
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: false },
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Recepcionista',
      description: 'Gestión de citas y pacientes',
      users: 8,
      color: 'blue',
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
            { key: 'update', label: 'Editar', granted: false },
            { key: 'delete', label: 'Eliminar', granted: false },
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
                { key: 'get', label: 'Detalle', granted: true },
              ]
            },
            { key: 'create', label: 'Crear', granted: true },
            { key: 'update', label: 'Editar', granted: true },
            { key: 'delete', label: 'Eliminar', granted: false },
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Usuario',
      description: 'Acceso básico al sistema',
      users: 45,
      color: 'green',
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
                { key: 'list', label: 'Listar', granted: false },
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
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesUserCount = true;
    if (userCountFilter === '1-10') matchesUserCount = role.users <= 10;
    else if (userCountFilter === '11-20') matchesUserCount = role.users >= 11 && role.users <= 20;
    else if (userCountFilter === '21+') matchesUserCount = role.users >= 21;
    
    return matchesSearch && matchesUserCount;
  });

  const hasActiveFilters = userCountFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Cantidad de Usuarios') {
      setUserCountFilter(value as string);
    }
  };

  const clearFilters = () => {
    setUserCountFilter('all');
  };

  const filters = [
    {
      label: 'Cantidad de Usuarios',
      value: 'userCount',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos' },
        { value: '1-10', label: '1-10 usuarios' },
        { value: '11-20', label: '11-20 usuarios' },
        { value: '21+', label: '21+ usuarios' },
      ],
      selectedValue: userCountFilter,
    },
  ];

  return (
    <div className="space-y-4">

      {/* Search, Filters and View Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-xs"
          />
        </div>
        
        <FilterPopover
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Roles Views */}
      {filteredRoles.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => navigate(`/accounts/roles/${role.id}`)}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all">
                      <Shield size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-900 truncate">{role.name}</h3>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{role.description}</p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      {role.modules.slice(0, 2).map((module, index) => (
                        <PermissionBadge
                          key={index}
                          moduleName={module.name}
                          moduleKey={module.key}
                          permissions={module.permissions}
                          color={module.color}
                        />
                      ))}
                      {role.modules.length > 2 && (
                        <div className="relative ml-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMorePermsPopover(morePermsPopover === role.id ? null : role.id); }}
                            className="text-[9px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            +{role.modules.length - 2} más
                          </button>
                          {morePermsPopover === role.id && (
                            <div className="fixed z-[200] w-52 bg-white border border-gray-200 rounded-xl shadow-lg" style={{ marginTop: '4px' }}>
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 rounded-t-xl">
                                <p className="text-[10px] font-semibold text-gray-900">Otros módulos</p>
                              </div>
                              <div className="p-2 flex flex-wrap gap-1.5">
                                {role.modules.slice(2).map((module, index) => (
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
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between rounded-b-xl">
                    <div className="flex items-center gap-1.5">
                      <Users size={10} className="text-gray-400" />
                      <span className="text-[9px] text-gray-500">Usuarios</span>
                    </div>
                    <span className="text-[9px] font-medium text-gray-700">{role.users} asignados</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredRoles.map((role) => {
                const colorClasses = {
                  red: 'bg-red-100 text-red-600',
                  purple: 'bg-purple-100 text-purple-600',
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                }[role.color];

                return (
                  <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg ${colorClasses} flex items-center justify-center flex-shrink-0`}>
                        <Shield size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-medium text-gray-900">{role.name}</h3>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>

                      <div className="text-xs text-gray-600">
                        <span className="font-medium text-gray-900">{role.users}</span> usuarios
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Rol</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Descripción</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Usuarios</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Permisos</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRoles.map((role) => {
                    const colorClasses = {
                      red: 'bg-red-100 text-red-600',
                      purple: 'bg-purple-100 text-purple-600',
                      blue: 'bg-blue-100 text-blue-600',
                      green: 'bg-green-100 text-green-600',
                    }[role.color];

                    return (
                      <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${colorClasses} flex items-center justify-center flex-shrink-0`}>
                              <Shield size={16} />
                            </div>
                            <span className="text-xs font-medium text-gray-900">{role.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600">{role.description}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-900">{role.users}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600">{role.modules.flatMap(module => module.permissions.length).reduce((a, b) => a + b, 0)} permisos</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-xs font-medium text-gray-900 mb-1">No se encontraron roles</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onCreate={(roleData: NewRoleData) => {
          console.log('Nuevo rol creado:', roleData);
        }}
      />
    </div>
  );
}