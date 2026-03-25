import { Search, Plus, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { Badge } from '../components/Badge';

type ViewMode = 'cards' | 'table' | 'list';

export function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');

  const patients = [
    { id: 1, name: 'María García', age: 45, email: 'maria.garcia@email.com', phone: '+1 234 567 8901', lastVisit: '2026-03-15', doctor: 'Dr. López' },
    { id: 2, name: 'Juan Pérez', age: 32, email: 'juan.perez@email.com', phone: '+1 234 567 8902', lastVisit: '2026-03-10', doctor: 'Dra. Martínez' },
    { id: 3, name: 'Ana Rodríguez', age: 28, email: 'ana.rodriguez@email.com', phone: '+1 234 567 8903', lastVisit: '2026-03-18', doctor: 'Dr. Sánchez' },
    { id: 4, name: 'Carlos Díaz', age: 51, email: 'carlos.diaz@email.com', phone: '+1 234 567 8904', lastVisit: '2026-03-12', doctor: 'Dra. Torres' },
    { id: 5, name: 'Laura Fernández', age: 38, email: 'laura.fernandez@email.com', phone: '+1 234 567 8905', lastVisit: '2026-03-17', doctor: 'Dr. López' },
  ];

  const doctors = Array.from(new Set(patients.map(p => p.doctor)));

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = doctorFilter === 'all' || patient.doctor === doctorFilter;
    
    let matchesAge = true;
    if (ageRangeFilter === '0-18') matchesAge = patient.age <= 18;
    else if (ageRangeFilter === '19-35') matchesAge = patient.age >= 19 && patient.age <= 35;
    else if (ageRangeFilter === '36-50') matchesAge = patient.age >= 36 && patient.age <= 50;
    else if (ageRangeFilter === '51+') matchesAge = patient.age >= 51;
    
    return matchesSearch && matchesDoctor && matchesAge;
  });

  const hasActiveFilters = doctorFilter !== 'all' || ageRangeFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Doctor Asignado') {
      setDoctorFilter(value as string);
    } else if (filterLabel === 'Rango de Edad') {
      setAgeRangeFilter(value as string);
    }
  };

  const clearFilters = () => {
    setDoctorFilter('all');
    setAgeRangeFilter('all');
  };

  const filters = [
    {
      label: 'Doctor Asignado',
      value: 'doctor',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos los doctores' },
        ...doctors.map(d => ({ value: d, label: d })),
      ],
      selectedValue: doctorFilter,
    },
    {
      label: 'Rango de Edad',
      value: 'age',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todas las edades' },
        { value: '0-18', label: '0-18 años' },
        { value: '19-35', label: '19-35 años' },
        { value: '36-50', label: '36-50 años' },
        { value: '51+', label: '51+ años' },
      ],
      selectedValue: ageRangeFilter,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Pacientes</h1>
          <p className="text-xs text-gray-500">Gestión de pacientes</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
          <Plus size={14} />
          Nuevo
        </button>
      </div>

      {/* Search, Filters and View Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-xs"
          />
        </div>
        
        <FilterPopover
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Patients Views */}
      {filteredPatients.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-lg text-white font-semibold">
                        {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <Badge variant="gray">
                      {patient.age} años
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{patient.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">{patient.doctor}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail size={12} className="text-gray-400" />
                      {patient.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {patient.phone}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Última visita: <span className="font-medium text-gray-900">
                        {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-white font-medium">
                      {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{patient.name}</h3>
                    <p className="text-xs text-gray-500">{patient.doctor}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-600">
                      {patient.age} años
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Paciente</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teléfono</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Edad</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Doctor</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Última Visita</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/patients/${patient.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white font-medium">
                              {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{patient.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{patient.phone}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{patient.age} años</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{patient.doctor}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No se encontraron pacientes</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}
    </div>
  );
}