import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DetailCardProps {
  title: string;
  icon: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  badge?: ReactNode;
}

export function DetailCard({ title, icon: Icon, actions, children, badge }: DetailCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Icon size={14} className="text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">{title}</h3>
            {badge}
          </div>
          {actions}
        </div>
      </div>
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}