import { List, Plus, Search, Stethoscope, Droplet, MapPin, Building, Tag, X, Trash2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useHeader } from '../components/HeaderContext';
import { Badge } from '../components/Badge';

interface CatalogDef {
  id: number;
  name: string;
  icon: React.ElementType;
  description: string;
  values: string[];
  lastModified: string;
}

const catalogs: CatalogDef[] = [
  { id: 1, name: 'Especialidades', icon: Stethoscope, description: 'Especialidades médicas disponibles', lastModified: '2026-03-20', values: ['Cardiología', 'Pediatría', 'Neurología', 'Dermatología', 'Traumatología', 'Oftalmología', 'Ginecología', 'Urología', 'Oncología', 'Psiquiatría', 'Endocrinología', 'Nefrología', 'Reumatología', 'Neumología', 'Gastroenterología', 'Otra'] },
  { id: 2, name: 'Tipos de Identificación', icon: Tag, description: 'Tipos de documentos de identidad', lastModified: '2026-02-28', values: ['DNI', 'NIE', 'Pasaporte', 'Otro'] },
  { id: 3, name: 'Género', icon: List, description: 'Opciones de género disponibles', lastModified: '2026-01-15', values: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'] },
  { id: 5, name: 'Tipos de Cita', icon: List, description: 'Consulta, Control, Seguimiento, etc.', lastModified: '2026-03-18', values: ['Consulta General', 'Control', 'Seguimiento', 'Primera Consulta', 'Urgencia', 'Segunda Opinión'] },
];

function CatalogModal({ catalog, onClose }: { catalog: CatalogDef | null; onClose: () => void }) {
  const [items, setItems] = useState<string[]>(catalog?.values || []);
  const [newItem, setNewItem] = useState('');

  if (!catalog) return null;

  const Icon = catalog.icon;

  const handleAdd = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-96 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Icon size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{catalog.name}</h2>
              <p className="text-[9px] text-gray-500">{catalog.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Add new */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Agregar nuevo valor..."
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button onClick={handleAdd} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={13} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
              <span className="text-[10px] text-gray-900 font-medium">{item}</span>
              <button
                onClick={() => handleRemove(index)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <span className="text-[10px] text-gray-500">{items.length} elementos</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded transition-colors">Cancelar</button>
            <button onClick={onClose} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Catalogs() {
  useHeader({ title: 'Catálogos', subtitle: 'Gestión de catálogos del sistema' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogDef | null>(null);

  const filtered = catalogs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Buscar catálogos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-xs"
        />
      </div>

      {/* Catalogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((catalog) => {
          const Icon = catalog.icon;
          return (
            <div
              key={catalog.id}
              onClick={() => setSelectedCatalog(catalog)}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
            >
              <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-gray-900">{catalog.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{catalog.description}</p>
                </div>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-between">
                <Badge variant="blue" size="sm">{catalog.values.length} elementos</Badge>
                <span className="text-[9px] text-gray-400">{new Date(catalog.lastModified).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-xs font-medium text-gray-900 mb-1">No se encontraron catálogos</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda</p>
        </div>
      )}

      {/* Catalog Modal */}
      <CatalogModal catalog={selectedCatalog} onClose={() => setSelectedCatalog(null)} />
    </div>
  );
}
