import { Star } from 'lucide-react';
import { User } from './UserCard';
import { UserMenu } from './UserMenu';
import { useNavigate } from 'react-router';
import { Badge } from './Badge';

interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onUpdate: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserListItem({ user, onEdit, onUpdate, onDelete }: UserListItemProps) {
  const navigate = useNavigate();
  
  const toggleFavorite = () => {
    onUpdate({ ...user, isFavorite: !user.isFavorite });
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(`/accounts/users/${user.id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-white group-hover:ring-blue-200 transition-all">
          <span className="text-[10px] text-white font-medium">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-gray-900 truncate">{user.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            {user.lastActivity && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <p className="text-xs text-gray-400">{user.lastActivity}</p>
              </>
            )}
          </div>
        </div>

        {/* Status & Role */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user.status && (
            <Badge variant={user.status === 'Confirmado' ? 'green' : 'yellow'}>
              {user.status}
            </Badge>
          )}
          <Badge variant={user.role === 'Developer' ? 'purple' : 'blue'}>
            {user.role}
          </Badge>
        </div>

        {/* Favorite & Actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Star
            size={14}
            className={user.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
          <UserMenu
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user.id)}
            onToggleFavorite={toggleFavorite}
            isFavorite={user.isFavorite}
          />
        </div>
      </div>
    </div>
  );
}