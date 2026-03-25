import { Grid3x3, List, LayoutList } from 'lucide-react';

type ViewMode = 'cards' | 'table' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5">
      <button
        onClick={() => onChange('cards')}
        className={`p-1.5 rounded transition-colors ${
          viewMode === 'cards'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Vista de tarjetas"
      >
        <Grid3x3 size={14} />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-1.5 rounded transition-colors ${
          viewMode === 'list'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Vista de lista"
      >
        <LayoutList size={14} />
      </button>
      <button
        onClick={() => onChange('table')}
        className={`p-1.5 rounded transition-colors ${
          viewMode === 'table'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Vista de tabla"
      >
        <List size={14} />
      </button>
    </div>
  );
}
