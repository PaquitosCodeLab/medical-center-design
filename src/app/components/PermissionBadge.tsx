import { useState, useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Badge } from './Badge';

interface Permission {
  key: string;
  label: string;
  granted: boolean;
  children?: Permission[];
}

interface PermissionBadgeProps {
  moduleName: string;
  moduleKey: string;
  permissions: Permission[];
  color?: string;
}

const moduleIcons: { [key: string]: string } = {
  user: '👤',
  role: '🛡️',
  person: '🧑‍🤝‍🧑',
  developer: '🔧',
};

export function PermissionBadge({ moduleName, moduleKey, permissions, color = 'blue' }: PermissionBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        badgeRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  // Función recursiva para contar permisos otorgados
  const countGrantedPermissions = (perms: Permission[]): number => {
    let count = 0;
    perms.forEach(p => {
      if (p.granted) count++;
      if (p.children) {
        count += countGrantedPermissions(p.children);
      }
    });
    return count;
  };

  // Función para obtener permisos lineales optimizados
  const getLinearPermissions = (perms: Permission[]): Permission[] => {
    const result: Permission[] = [];
    
    // Primero, verificar si TODOS los permisos están granted (incluyendo el permiso "full" y todos sus hijos)
    const checkAllGranted = (permissions: Permission[]): boolean => {
      return permissions.every(p => {
        if (!p.granted) return false;
        if (p.children && p.children.length > 0) {
          return checkAllGranted(p.children);
        }
        return true;
      });
    };
    
    const allPermissionsGranted = checkAllGranted(perms);
    
    // Si todos los permisos están granted, mostrar solo "Todos los permisos"
    if (allPermissionsGranted) {
      const fullPermission = perms.find(p => p.key === 'full');
      if (fullPermission && fullPermission.granted) {
        result.push({ ...fullPermission, label: 'Todos los permisos', children: undefined });
        return result;
      }
    }
    
    // Si no todos están granted, procesar normalmente (pero sin mostrar "Completo")
    perms.forEach(p => {
      // Saltar el permiso "full" si no todos los permisos están granted
      if (p.key === 'full') {
        return;
      }
      
      // Si tiene hijos (como "Lectura")
      if (p.children && p.children.length > 0) {
        // Verificar si TODOS los hijos están granted
        const allChildrenGranted = p.children.every(child => child.granted);
        
        if (allChildrenGranted && p.granted) {
          // Si todos los hijos están granted y el padre también, mostrar solo el padre
          result.push({ ...p, children: undefined });
        } else {
          // Si no todos los hijos están granted, mostrar solo los hijos que sí lo están
          p.children.forEach(child => {
            if (child.granted) {
              result.push({ ...child, children: undefined });
            }
          });
        }
      } else {
        // Permisos sin hijos que están granted
        if (p.granted) {
          result.push({ ...p, children: undefined });
        }
      }
    });
    
    return result;
  };

  const grantedCount = countGrantedPermissions(permissions);
  const linearPermissions = getLinearPermissions(permissions);

  const renderPermission = (permission: Permission) => {
    return (
      <div key={permission.key} className="flex items-center gap-1.5 py-0.5">
        <CheckCircle size={10} className="text-blue-600 flex-shrink-0" />
        <span className="text-[10px] text-gray-900 font-medium">
          {permission.label}
        </span>
      </div>
    );
  };

  return (
    <div className="relative inline-block" ref={badgeRef}>
      <button
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        className="transition-all hover:shadow-sm rounded-full"
      >
        <Badge variant="blue" size="sm">
          <span className="text-[10px]">{moduleIcons[moduleKey] || '📦'}</span>
          <span>{moduleName}</span>
          <span className="ml-0.5 px-1 py-0 bg-white rounded-full text-[10px] font-semibold leading-none">
            {grantedCount}
          </span>
        </Badge>
      </button>

      {showPopover && linearPermissions.length > 0 && (
        <div
          ref={popoverRef}
          className="absolute bottom-full left-0 mb-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          onMouseLeave={() => setShowPopover(false)}
        >
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <span className="text-xs">{moduleIcons[moduleKey] || '📦'}</span>
            <h4 className="text-[10px] font-semibold text-gray-900">{moduleName}</h4>
            <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded-full ml-auto">{grantedCount}</span>
          </div>
          <div className="px-3 py-2 space-y-0 max-h-48 overflow-y-auto">
            {linearPermissions.map(permission => renderPermission(permission))}
          </div>
        </div>
      )}
    </div>
  );
}