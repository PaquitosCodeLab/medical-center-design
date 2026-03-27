import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useHeader } from '../components/HeaderContext';
import { UserCard, User } from '../components/UserCard';
import { UserTable } from '../components/UserTable';
import { UserListItem } from '../components/UserListItem';
import { EditUserModal } from '../components/EditUserModal';
import { CreateUserModal, NewUserData } from '../components/CreateUserModal';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';

type ViewMode = 'cards' | 'table' | 'list';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Alexa Sarah Martinez',
    email: 'alexamartinez075@gmail.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 2 horas',
  },
  {
    id: '2',
    name: 'Bruce Banner Sanchez',
    email: 'hulkdestroyer@gmail.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 1 día',
  },
  {
    id: '3',
    name: 'Daniel Martinez',
    email: 'danielpaumartheopaulin3@gmail.co...',
    role: 'Developer',
    isFavorite: true,
    status: 'Pendiente',
    lastActivity: 'hace 3 días',
  },
  {
    id: '4',
    name: 'Daniel Martínez',
    email: 'danielmartheospaulin3@gmail.com',
    role: 'Developer',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 5 horas',
  },
  {
    id: '5',
    name: 'Docker Test',
    email: 'docker.compose.test@mrch.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 2 días',
  },
  {
    id: '6',
    name: 'Docker Test',
    email: 'docker.test.test@mrch.com',
    role: 'User',
    isFavorite: true,
    status: 'Pendiente',
    lastActivity: 'hace 1 semana',
  },
  {
    id: '7',
    name: 'Erick Martin',
    email: 'erick@gmail.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 30 min',
  },
  {
    id: '8',
    name: 'Jhon Cana',
    email: 'jhoncana21@gmail.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'hace 4 horas',
  },
  {
    id: '9',
    name: 'Jhon Cana',
    email: 'jhoncana@test.com',
    role: 'User',
    isFavorite: true,
    status: 'Pendiente',
    lastActivity: 'hace 2 semanas',
  },
  {
    id: '10',
    name: 'Jhon Doe',
    email: 'doe@test.com',
    role: 'User',
    isFavorite: true,
    status: 'Confirmado',
    lastActivity: 'en línea',
  },
];

export function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [roleFilter, setRoleFilter] = useState('all');
  const [favoriteFilter, setFavoriteFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  useHeader({
    title: 'Usuarios',
    subtitle: 'Gestión de usuarios del sistema',
    actions: (
      <button onClick={() => setIsCreateUserModalOpen(true)} className="p-1 text-white" title="Nuevo Usuario">
        <Plus size={15} />
      </button>
    ),
  });

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleUserDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    handleUserUpdate(updatedUser);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleCreateUser = (newUser: NewUserData) => {
    const newUserWithId: User = {
      id: String(users.length + 1),
      name: `${newUser.firstName} ${newUser.lastName}`.trim(),
      email: newUser.email,
      role: 'User',
      isFavorite: false,
      status: 'Pendiente',
      lastActivity: 'recién creado',
    };
    setUsers([...users, newUserWithId]);
    setIsCreateUserModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesFavorite = favoriteFilter === 'all' || (favoriteFilter === 'favorites' && user.isFavorite);
    
    return matchesSearch && matchesRole && matchesFavorite;
  });

  const hasActiveFilters = roleFilter !== 'all' || favoriteFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Rol') {
      setRoleFilter(value as string);
    } else if (filterLabel === 'Favoritos') {
      setFavoriteFilter(value as string);
    }
  };

  const clearFilters = () => {
    setRoleFilter('all');
    setFavoriteFilter('all');
  };

  const filters = [
    {
      label: 'Rol',
      value: 'role',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos los roles' },
        { value: 'User', label: 'User' },
        { value: 'Developer', label: 'Developer' },
      ],
      selectedValue: roleFilter,
    },
    {
      label: 'Favoritos',
      value: 'favorite',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'favorites', label: 'Solo favoritos' },
      ],
      selectedValue: favoriteFilter,
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
            placeholder="Buscar usuarios..."
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

      {/* User Views */}
      {filteredUsers.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onUpdate={handleUserUpdate}
                  onDelete={handleUserDelete}
                />
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onUpdate={handleUserUpdate}
                  onDelete={handleUserDelete}
                />
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onUpdate={handleUserUpdate}
              onDelete={handleUserDelete}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search query or filters</p>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}