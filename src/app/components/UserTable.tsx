import { Star } from 'lucide-react';
import { User } from './UserCard';
import { UserMenu } from './UserMenu';
import { useNavigate } from 'react-router';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onUpdate: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserTable({ users, onEdit, onUpdate, onDelete }: UserTableProps) {
  const navigate = useNavigate();
  
  const toggleFavorite = (user: User) => {
    onUpdate({ ...user, isFavorite: !user.isFavorite });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Usuario</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Rol</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Actividad</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/accounts/users/${user.id}`)}
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-white group-hover:ring-blue-200 transition-all">
                      <span className="text-xs text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{user.email}</span>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'Developer'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {user.status && (
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Confirmado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.status}
                    </span>
                  )}
                </td>

                {/* Last Activity */}
                <td className="px-4 py-3">
                  {user.lastActivity && (
                    <span className="text-sm text-gray-500">{user.lastActivity}</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Star
                      size={14}
                      className={user.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                    <UserMenu
                      onEdit={() => onEdit(user)}
                      onDelete={() => onDelete(user.id)}
                      onToggleFavorite={() => toggleFavorite(user)}
                      isFavorite={user.isFavorite}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}