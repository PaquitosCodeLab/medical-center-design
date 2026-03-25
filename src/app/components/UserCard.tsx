import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';
import { Badge } from './Badge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Developer';
  avatar?: string;
  isFavorite: boolean;
  status?: 'Confirmado' | 'Pendiente';
  lastActivity?: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onUpdate: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserCard({ user, onEdit, onUpdate, onDelete }: UserCardProps) {
  const navigate = useNavigate();
  
  const toggleFavorite = () => {
    const updatedUser = { ...user, isFavorite: !user.isFavorite };
    onUpdate(updatedUser);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all relative cursor-pointer group"
      onClick={() => navigate(`/accounts/users/${user.id}`)}
    >
      {/* Favorite Star */}
      <div className="absolute top-3 right-3 flex gap-1 items-center z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Star
            size={14}
            className={user.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3 overflow-hidden ring-2 ring-white group-hover:ring-blue-200 transition-all">
          {user.avatar ? (
            <ImageWithFallback
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-gray-900 mb-0.5 text-center px-2">{user.name}</h3>

        {/* Email */}
        <p className="text-xs text-gray-500 mb-2 truncate max-w-full px-2">{user.email}</p>

        {/* Role Badge and Status */}
        <div className="flex items-center gap-2">
          <Badge variant={user.role === 'Developer' ? 'purple' : 'blue'}>
            {user.role}
          </Badge>
          {user.status && (
            <Badge variant={user.status === 'Confirmado' ? 'green' : 'yellow'}>
              {user.status}
            </Badge>
          )}
        </div>

        {/* Last Activity */}
        {user.lastActivity && (
          <p className="text-xs text-gray-400 mt-2">Activo {user.lastActivity}</p>
        )}
      </div>
    </div>
  );
}