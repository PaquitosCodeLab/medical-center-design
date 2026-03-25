import { Search, Plus, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { FilterPopover } from '../components/FilterPopover';
import { ViewToggle } from '../components/ViewToggle';
import { Badge } from '../components/Badge';

type ViewMode = 'cards' | 'table' | 'list';

export function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const doctors = [
    { id: 1, name: 'Dr. Carlos López', specialty: 'Cardiología', email: 'carlos.lopez@hospital.com', phone: '+1 234 567 8901', patients: 45, status: 'Activo' },
    { id: 2, name: 'Dra. María Martínez', specialty: 'Pediatría', email: 'maria.martinez@hospital.com', phone: '+1 234 567 8902', patients: 62, status: 'Activo' },
    { id: 3, name: 'Dr. José Sánchez', specialty: 'Neurología', email: 'jose.sanchez@hospital.com', phone: '+1 234 567 8903', patients: 38, status: 'Activo' },
    { id: 4, name: 'Dra. Ana Torres', specialty: 'Dermatología', email: 'ana.torres@hospital.com', phone: '+1 234 567 8904', patients: 51, status: 'Inactivo' },
  ];

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const hasActiveFilters = specialtyFilter !== 'all' || statusFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Especialidad') {
      setSpecialtyFilter(value as string);
    } else if (filterLabel === 'Estado') {
      setStatusFilter(value as string);
    }
  };

  const clearFilters = () => {
    setSpecialtyFilter('all');
    setStatusFilter('all');
  };

  const filters = [
    {
      label: 'Especialidad',
      value: 'specialty',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todas las especialidades' },
        ...specialties.map(s => ({ value: s, label: s })),
      ],
      selectedValue: specialtyFilter,
    },
    {
      label: 'Estado',
      value: 'status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ],
      selectedValue: statusFilter,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Doctores</h1>
          <p className="text-xs text-gray-500">Gestión de doctores y especialistas</p>
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
            placeholder="Buscar doctores..."
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

      {/* Doctors Views */}
      {filteredDoctors.length > 0 ? (
        <>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/doctors/${doctor.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <Badge variant={doctor.status === 'Activo' ? 'green' : 'gray'}>
                      {doctor.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">{doctor.specialty}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail size={12} className="text-gray-400" />
                      {doctor.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {doctor.phone}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-900">{doctor.patients}</span> pacientes activos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/doctors/${doctor.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-white font-medium">
                      {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-gray-900">{doctor.patients}</span> pacientes
                    </div>
                    <Badge variant={doctor.status === 'Activo' ? 'green' : 'gray'}>
                      {doctor.status}
                    </Badge>
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
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Doctor</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Especialidad</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teléfono</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pacientes</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/doctors/${doctor.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white font-medium">
                              {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{doctor.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{doctor.specialty}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{doctor.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{doctor.phone}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{doctor.patients}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doctor.status === 'Activo'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doctor.status}
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
          <h3 className="text-sm font-medium text-gray-900 mb-1">No se encontraron doctores</h3>
          <p className="text-xs text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}
    </div>
  );
}