import { useState, useRef, useEffect } from 'react';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

interface DetailHeaderMenuProps {
  editTitle: string;
  deleteTitle: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function DetailHeaderMenu({ editTitle, deleteTitle, onEdit, onDelete }: DetailHeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      <button onClick={onEdit} className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors" title={editTitle}>
        <Edit size={15} />
      </button>
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(!open)} className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors" title="Más opciones">
          <MoreVertical size={15} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100] pointer-events-auto">
            <button onClick={() => { onDelete(); setOpen(false); }} className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-gray-50 flex items-center gap-2">
              <Trash2 size={14} />
              {deleteTitle}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
