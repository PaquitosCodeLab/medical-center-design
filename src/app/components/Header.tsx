import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Settings, HelpCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useHeaderConfig } from './HeaderContext';
import { NotificationsPopover } from './NotificationsPopover';

export function Header() {
  const { darkMode } = useTheme();
  const { config } = useHeaderConfig();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const toolbarButtons = (
    <>
      <NotificationsPopover darkMode={darkMode} />
      <button
        className={`p-1.5 rounded-full transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Help"
      >
        <HelpCircle size={15} />
      </button>
      <button
        onClick={() => navigate('/settings/preferences')}
        className={`p-1.5 rounded-full transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Settings"
      >
        <Settings size={15} />
      </button>
    </>
  );

  return (
    <>
      {/* Invisible sentinel - when this scrolls out of view, header becomes sticky bar */}
      <div ref={sentinelRef} className="h-0 w-0" />

      {scrolled ? (
        /* Sticky bar mode */
        <div className={`sticky top-0 z-30 transition-all duration-300 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b`}>
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-3 min-w-0">
              {config.backTo && (
                <button
                  onClick={() => navigate(config.backTo!)}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="min-w-0">
                <h1 className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{config.title}</h1>
                <p className={`text-[10px] truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{config.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {config.actions && (
                <div className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer">
                  {config.actions}
                </div>
              )}
              <div className="inline-flex items-center gap-1">
                {toolbarButtons}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Floating mode — title left, pill right */
        <div className="sticky top-0 z-30 pointer-events-none">
          <div className="flex items-center justify-between px-6 pt-4 pb-0">
            <div className="flex items-center gap-3 pointer-events-auto">
              {config.backTo && (
                <button
                  onClick={() => navigate(config.backTo!)}
                  className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h1 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{config.title}</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{config.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              {config.actions && (
                <div className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer shadow-blue-500/30">
                  {config.actions}
                </div>
              )}
              <div className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-full shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-700 shadow-black/30' : 'bg-white border-gray-200 shadow-gray-200/60'}`}>
                {toolbarButtons}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
