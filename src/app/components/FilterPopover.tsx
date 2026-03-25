import { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  type: 'select' | 'multiselect';
  options: { value: string; label: string }[];
  selectedValue?: string;
  selectedValues?: string[];
}

interface FilterPopoverProps {
  filters: FilterOption[];
  onFilterChange: (filterLabel: string, value: string | string[]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterPopover({ filters, onFilterChange, onClearAll, hasActiveFilters }: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors text-xs font-medium ${ 
          hasActiveFilters
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter size={14} />
        Filtros
        {hasActiveFilters && (
          <span className="w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
            {filters.filter(f => 
              (f.type === 'select' && f.selectedValue && f.selectedValue !== 'all') ||
              (f.type === 'multiselect' && f.selectedValues && f.selectedValues.length > 0)
            ).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900">Filtros</h3>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onClearAll();
                  setIsOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar todo
              </button>
            )}
          </div>

          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            {filters.map((filter) => (
              <div key={filter.label}>
                <label className="block text-[10px] font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' && (
                  <select
                    value={filter.selectedValue || 'all'}
                    onChange={(e) => onFilterChange(filter.label, e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 bg-white"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === 'multiselect' && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filter.selectedValues?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValues = filter.selectedValues || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter(v => v !== option.value);
                            onFilterChange(filter.label, newValues);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}