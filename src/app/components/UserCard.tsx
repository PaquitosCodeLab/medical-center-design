import { Star, Mail, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

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
      className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
      onClick={() => navigate(`/accounts/users/${user.id}`)}
    >
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover:shadow-md transition-all">
          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-gray-900 truncate">{user.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{user.role}</span>
            {user.status && (
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                user.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{user.status}</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Star size={14} className={user.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
        </button>
      </div>

      {/* Info Rows */}
      <div className="px-4 pb-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <Mail size={11} className="text-blue-600 flex-shrink-0" />
          <span className="text-[10px] text-gray-500 truncate">{user.email}</span>
        </div>
      </div>

      {/* Footer */}
      {user.lastActivity && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center gap-1.5 rounded-b-xl">
          {user.lastActivity === 'en línea' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[9px] text-green-600 font-medium">En línea</span>
            </>
          ) : (
            <>
              <Clock size={10} className="text-gray-400" />
              <span className="text-[9px] text-gray-500">Activo {user.lastActivity}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
