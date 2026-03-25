import { useState } from 'react';

interface DoctorAvatarProps {
  name: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DoctorAvatar({ name, color, isSelected, onClick }: DoctorAvatarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return fullName.substring(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
          isSelected
            ? 'ring-4 ring-blue-500 ring-offset-2'
            : 'hover:ring-2 hover:ring-gray-300'
        }`}
        style={{ 
          backgroundColor: color,
          color: '#FFFFFF'
        }}
      >
        {getInitials(name)}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap z-10">
          {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
