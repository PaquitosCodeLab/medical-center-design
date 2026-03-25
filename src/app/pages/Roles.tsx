import { Shield, Users, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { PermissionBadge } from '../components/PermissionBadge';

type ViewMode = 'cards' | 'table' | 'list';

export function Roles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [userCountFilter, setUserCountFilter] = useState('all');
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Roles</h1>
          <p className="text-xs text-gray-500">Gestión de roles y permisos</p>
        </div>
        <button 
          onClick={() => setIsCreateRoleModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
        >
          <Plus size={14} />
          Nuevo Rol
        </button>
      </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRoles.map((role) => {
                const colorClasses = {
                  red: 'bg-red-100 text-red-600',
                  purple: 'bg-purple-100 text-purple-600',
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                }[role.color];

                return (
                  <div 
                    key={role.id} 
                    onClick={() => navigate(`/accounts/roles/${role.id}`)}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center`}>
                          <Shield size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{role.name}</h3>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600">
                        <span className="font-medium text-gray-900">{role.users}</span> usuarios con este rol
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Módulos y Permisos:</p>
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
                  </div>
                );
              })}
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
                      <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center flex-shrink-0`}>
                        <Shield size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
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
                            <span className="text-sm font-medium text-gray-900">{role.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{role.description}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{role.users}</span>
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
          <h3 className="text-sm font-medium text-gray-900 mb-1">No se encontraron roles</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}
    </div>
  );
}