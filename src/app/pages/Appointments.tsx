import { useState } from 'react';
import { Plus, CheckCircle, Clock, XCircle, Filter, Search } from 'lucide-react';
import { useHeader } from '../components/HeaderContext';
import { CalendarMonth } from '../components/calendar/CalendarMonth';
import { DaySchedule } from '../components/calendar/DaySchedule';
import { FilterPopover } from '../components/FilterPopover';
import { DatePickerPopover } from '../components/calendar/DatePickerPopover';
import { DoctorAvatar } from '../components/DoctorAvatar';

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  type: string;
  specialty: string;
  color: string;
}

const doctors = [
  { id: 1, name: 'Dr. López', color: '#3B82F6' },
  { id: 2, name: 'Dra. Martínez', color: '#8B5CF6' },
  { id: 3, name: 'Dr. Sánchez', color: '#10B981' },
  { id: 4, name: 'Dra. Torres', color: '#F59E0B' },
  { id: 5, name: 'Dr. Ramírez', color: '#EF4444' },
  { id: 6, name: 'Dra. García', color: '#EC4899' },
];

const allAppointments: Appointment[] = [
  { id: 1, patient: 'María García', doctor: 'Dr. López', date: '2026-03-19', time: '09:00 AM', status: 'Confirmada', type: 'Control', specialty: 'Cardiología', color: '#3B82F6' },
  { id: 2, patient: 'Juan Pérez', doctor: 'Dra. Martínez', date: '2026-03-19', time: '10:30 AM', status: 'Pendiente', type: 'Seguimiento', specialty: 'Pediatría', color: '#8B5CF6' },
  { id: 3, patient: 'Ana Rodríguez', doctor: 'Dr. Sánchez', date: '2026-03-19', time: '11:00 AM', status: 'Confirmada', type: 'Primera Vez', specialty: 'Neurología', color: '#10B981' },
  { id: 4, patient: 'Carlos Díaz', doctor: 'Dra. Torres', date: '2026-03-19', time: '02:00 PM', status: 'Cancelada', type: 'Consulta', specialty: 'Dermatología', color: '#F59E0B' },
  { id: 5, patient: 'Laura Fernández', doctor: 'Dr. López', date: '2026-03-20', time: '09:30 AM', status: 'Confirmada', type: 'Control', specialty: 'Cardiología', color: '#3B82F6' },
  { id: 6, patient: 'Pedro Martínez', doctor: 'Dra. Martínez', date: '2026-03-20', time: '11:00 AM', status: 'Pendiente', type: 'Consulta', specialty: 'Pediatría', color: '#8B5CF6' },
  { id: 7, patient: 'Sofía Gómez', doctor: 'Dr. Sánchez', date: '2026-03-21', time: '10:00 AM', status: 'Confirmada', type: 'Seguimiento', specialty: 'Neurología', color: '#10B981' },
  { id: 8, patient: 'Miguel Ángel', doctor: 'Dra. Torres', date: '2026-03-21', time: '03:00 PM', status: 'Confirmada', type: 'Primera Vez', specialty: 'Dermatología', color: '#F59E0B' },
  { id: 9, patient: 'Isabel Ruiz', doctor: 'Dr. López', date: '2026-03-22', time: '09:00 AM', status: 'Pendiente', type: 'Control', specialty: 'Cardiología', color: '#3B82F6' },
  { id: 10, patient: 'Roberto Silva', doctor: 'Dra. Martínez', date: '2026-03-22', time: '02:30 PM', status: 'Confirmada', type: 'Consulta', specialty: 'Pediatría', color: '#8B5CF6' },
  { id: 11, patient: 'Carmen Vega', doctor: 'Dr. Sánchez', date: '2026-03-25', time: '11:30 AM', status: 'Confirmada', type: 'Seguimiento', specialty: 'Neurología', color: '#10B981' },
  { id: 12, patient: 'Francisco Mora', doctor: 'Dra. Torres', date: '2026-03-25', time: '04:00 PM', status: 'Pendiente', type: 'Primera Vez', specialty: 'Dermatología', color: '#F59E0B' },
  { id: 13, patient: 'Elena Torres', doctor: 'Dr. Ramírez', date: '2026-03-26', time: '10:00 AM', status: 'Confirmada', type: 'Control', specialty: 'Traumatología', color: '#EF4444' },
  { id: 14, patient: 'David López', doctor: 'Dra. García', date: '2026-03-26', time: '01:00 PM', status: 'Pendiente', type: 'Consulta', specialty: 'Ginecología', color: '#EC4899' },
];

export function Appointments() {
  useHeader({
    title: 'Citas',
    subtitle: 'Gestión del calendario médico',
    actions: (
      <button className="p-1 text-white" title="Nueva Cita">
        <Plus size={15} />
      </button>
    ),
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const specialties = Array.from(new Set(allAppointments.map(a => a.specialty)));

  const filteredAppointments = allAppointments.filter(apt => {
    const matchesSearch = searchQuery === '' || 
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = doctorFilter === 'all' || apt.doctor === doctorFilter;
    const matchesSpecialty = specialtyFilter === 'all' || apt.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    
    return matchesSearch && matchesDoctor && matchesSpecialty && matchesStatus;
  });

  const hasActiveFilters = doctorFilter !== 'all' || specialtyFilter !== 'all' || statusFilter !== 'all';

  const handleFilterChange = (filterLabel: string, value: string | string[]) => {
    if (filterLabel === 'Doctor') {
      setDoctorFilter(value as string);
    } else if (filterLabel === 'Especialidad') {
      setSpecialtyFilter(value as string);
    } else if (filterLabel === 'Estado') {
      setStatusFilter(value as string);
    }
  };

  const clearFilters = () => {
    setDoctorFilter('all');
    setSpecialtyFilter('all');
    setStatusFilter('all');
  };

  const filters = [
    {
      label: 'Doctor',
      value: 'doctor',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'Todos los doctores' },
        ...doctors.map(d => ({ value: d.name, label: d.name })),
      ],
      selectedValue: doctorFilter,
    },
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
        { value: 'all', label: 'Todos los estados' },
        { value: 'Confirmada', label: 'Confirmada' },
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'Cancelada', label: 'Cancelada' },
      ],
      selectedValue: statusFilter,
    },
  ];

  const stats = {
    confirmed: filteredAppointments.filter(a => a.status === 'Confirmada').length,
    pending: filteredAppointments.filter(a => a.status === 'Pendiente').length,
    cancelled: filteredAppointments.filter(a => a.status === 'Cancelada').length,
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="space-y-4">

      {/* Stats Bar */}
      <div className="bg-white rounded-xl px-5 py-3 flex items-center justify-between border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] text-gray-500">Tienes</span>
            <span className="text-xs font-semibold text-gray-900">{stats.confirmed} confirmadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-semibold text-gray-900">{stats.pending} pendientes</span>
            <span className="text-[10px] text-gray-500">para hoy</span>
          </div>
        </div>
        <DatePickerPopover
          selectedDate={currentDate}
          onDateSelect={(date) => {
            setCurrentDate(date);
            setSelectedDate(date);
          }}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar citas, pacientes, doctores..."
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
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <CalendarMonth
            appointments={filteredAppointments}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={setSelectedDate}
            onMonthChange={navigateMonth}
            onTodayClick={goToToday}
          />
        </div>

        {/* Day Schedule */}
        <div className="lg:col-span-1">
          <DaySchedule
            appointments={filteredAppointments}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}