import { Bell, Settings, HelpCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5">
      <div className="flex items-center justify-end">
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Icon Buttons */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle size={18} />
          </button>

          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}