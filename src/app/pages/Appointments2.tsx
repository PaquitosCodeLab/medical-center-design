import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Calendar, Clock, User, Stethoscope, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, MoreVertical, Edit, Trash2, Eye, X } from 'lucide-react';
import { useHeader } from '../components/HeaderContext';
import { Badge } from '../components/Badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  duration: string;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  type: string;
  specialty: string;
  color: string;
  avatar: string;
}

const allAppointments: Appointment[] = [
  { id: 1, patient: 'María García', doctor: 'Dr. López', date: '2026-03-29', time: '09:00', duration: '30 min', status: 'Confirmada', type: 'Control', specialty: 'Cardiología', color: '#3B82F6', avatar: 'MG' },
  { id: 2, patient: 'Juan Pérez', doctor: 'Dra. Martínez', date: '2026-03-29', time: '09:30', duration: '45 min', status: 'Pendiente', type: 'Seguimiento', specialty: 'Pediatría', color: '#8B5CF6', avatar: 'JP' },
  { id: 3, patient: 'Ana Rodríguez', doctor: 'Dr. Sánchez', date: '2026-03-29', time: '10:00', duration: '30 min', status: 'Completada', type: 'Primera Vez', specialty: 'Neurología', color: '#10B981', avatar: 'AR' },
  { id: 4, patient: 'Carlos Díaz', doctor: 'Dra. Torres', date: '2026-03-29', time: '11:00', duration: '30 min', status: 'Cancelada', type: 'Consulta', specialty: 'Dermatología', color: '#F59E0B', avatar: 'CD' },
  { id: 5, patient: 'Laura Fernández', doctor: 'Dr. López', date: '2026-03-29', time: '11:30', duration: '45 min', status: 'Completada', type: 'Control', specialty: 'Cardiología', color: '#3B82F6', avatar: 'LF' },
  { id: 6, patient: 'Pedro Martínez', doctor: 'Dra. Martínez', date: '2026-03-29', time: '14:00', duration: '30 min', status: 'Pendiente', type: 'Consulta', specialty: 'Pediatría', color: '#8B5CF6', avatar: 'PM' },
  { id: 7, patient: 'Sofía Gómez', doctor: 'Dr. Sánchez', date: '2026-03-30', time: '10:00', duration: '30 min', status: 'Confirmada', type: 'Seguimiento', specialty: 'Neurología', color: '#10B981', avatar: 'SG' },
  { id: 8, patient: 'Miguel Ángel', doctor: 'Dra. Torres', date: '2026-03-30', time: '15:00', duration: '45 min', status: 'Confirmada', type: 'Primera Vez', specialty: 'Dermatología', color: '#F59E0B', avatar: 'MA' },
  { id: 9, patient: 'Isabel Ruiz', doctor: 'Dr. López', date: '2026-03-31', time: '09:00', duration: '30 min', status: 'Pendiente', type: 'Control', specialty: 'Cardiología', color: '#3B82F6', avatar: 'IR' },
  { id: 10, patient: 'Roberto Silva', doctor: 'Dr. Ramírez', date: '2026-03-31', time: '14:30', duration: '30 min', status: 'Confirmada', type: 'Consulta', specialty: 'Traumatología', color: '#EF4444', avatar: 'RS' },
  { id: 11, patient: 'Elena Torres', doctor: 'Dra. García', date: '2026-04-01', time: '10:00', duration: '45 min', status: 'Confirmada', type: 'Control', specialty: 'Ginecología', color: '#EC4899', avatar: 'ET' },
  { id: 12, patient: 'David López', doctor: 'Dr. López', date: '2026-04-01', time: '11:30', duration: '30 min', status: 'Pendiente', type: 'Seguimiento', specialty: 'Cardiología', color: '#3B82F6', avatar: 'DL' },
];

const weekChartData = [
  { day: 'Lun', citas: 6 },
  { day: 'Mar', citas: 8 },
  { day: 'Mié', citas: 5 },
  { day: 'Jue', citas: 9 },
  { day: 'Vie', citas: 7 },
  { day: 'Sáb', citas: 3 },
  { day: 'Dom', citas: 1 },
];

const statusConfig = {
  Pendiente: { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-100', dot: 'bg-yellow-500' },
  Confirmada: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
  Completada: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
  Cancelada: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500' },
};

export function Appointments2() {
  useHeader({
    title: 'Citas',
    subtitle: 'Gestión del calendario médico',
    actions: (
      <button className="p-1 text-white" title="Nueva Cita">
        <Plus size={15} />
      </button>
    ),
  });

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 29));
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [subModal, setSubModal] = useState<{ type: 'cancel' | 'complete'; aptId: number } | null>(null);
  const [subModalText, setSubModalText] = useState('');

  // Week navigation
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1)); // Monday (handle Sunday as end of week)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(selectedDate);
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const navigateWeek = (dir: 'prev' | 'next') => {
    if (dir === 'next') {
      const nextMonday = new Date(weekDays[0]);
      nextMonday.setDate(nextMonday.getDate() + 7);
      setSelectedDate(nextMonday);
    } else {
      const prevSunday = new Date(weekDays[0]);
      prevSunday.setDate(prevSunday.getDate() - 1);
      setSelectedDate(prevSunday);
    }
  };

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const dayAppointments = allAppointments
    .filter(a => a.date === selectedDateStr)
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => searchQuery === '' ||
      a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.time.localeCompare(a.time));

  const totalToday = allAppointments.filter(a => a.date === selectedDateStr).length;
  const confirmedToday = allAppointments.filter(a => a.date === selectedDateStr && a.status === 'Confirmada').length;
  const pendingToday = allAppointments.filter(a => a.date === selectedDateStr && a.status === 'Pendiente').length;
  const completedToday = allAppointments.filter(a => a.date === selectedDateStr && a.status === 'Completada').length;
  const cancelledToday = allAppointments.filter(a => a.date === selectedDateStr && a.status === 'Cancelada').length;

  return (
    <div className="space-y-4">
      {/* Week Strip + Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Week Navigation */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateWeek('prev')} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold text-gray-900">
              {monthNames[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
            </span>
            <button onClick={() => navigateWeek('next')} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button onClick={() => setSelectedDate(new Date())} className="text-[10px] font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            Hoy
          </button>
        </div>

        {/* Day Selector Strip */}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, i) => {
            const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDateStr;
            const dayCount = allAppointments.filter(a => a.date === dateStr).length;
            const isToday = dateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center py-3 transition-all relative ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className={`text-[9px] font-medium uppercase ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>{dayNames[i]}</span>
                <span className={`text-lg font-bold mt-0.5 ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>{day.getDate()}</span>
                {dayCount > 0 && (
                  <span className={`text-[8px] font-semibold mt-1 px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>{dayCount}</span>
                )}
                {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Appointment List Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Citas del Día</h3>
                </div>
                <div className="relative flex-1 max-w-[200px] ml-3">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-[10px]"
                  />
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-1">
              {([
                { value: 'all' as const, label: 'Todas', count: totalToday },
                { value: 'Pendiente' as const, label: 'Pendientes', count: pendingToday },
                { value: 'Confirmada' as const, label: 'Confirmadas', count: confirmedToday },
                { value: 'Completada' as const, label: 'Completadas', count: completedToday },
                { value: 'Cancelada' as const, label: 'Canceladas', count: cancelledToday },
              ]).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${
                    statusFilter === tab.value
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1 py-0.5 rounded-full ${
                    statusFilter === tab.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Appointment List */}
            {dayAppointments.length > 0 ? (
              <div>
                {dayAppointments.map((apt) => {
                  const StatusIcon = statusConfig[apt.status].icon;
                  return (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      {/* Time */}
                      <div className="flex flex-col items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
                        <span className="text-sm font-bold text-blue-700 leading-none">{new Date(apt.date).getDate()}</span>
                        <span className="text-[8px] font-medium text-blue-500 uppercase">{new Date(apt.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <p className="text-[10px] font-bold text-gray-900">{apt.time}</p>
                        <p className="text-[9px] text-gray-400">{apt.duration}</p>
                      </div>
                      <div className="w-0.5 h-10 rounded-full flex-shrink-0 bg-blue-500" />
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-blue-600">
                        {apt.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span onClick={(e) => { e.stopPropagation(); navigate(`/patients/${apt.id}`); }} className="text-[10px] font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">{apt.patient}</span>
                          <span className={`inline-flex items-center gap-0.5 text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${statusConfig[apt.status].color}`}>
                            <StatusIcon size={8} />
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-2">
                          <span onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${apt.id}`); }} className="flex items-center gap-0.5 hover:text-blue-600 hover:underline cursor-pointer"><Stethoscope size={9} />{apt.doctor}</span>
                          <span>·</span>
                          <span>{apt.type}</span>
                          <span>·</span>
                          <span>{apt.specialty}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Calendar size={20} className="text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-500">No hay citas para este día</p>
                <p className="text-[10px] text-gray-400 mt-1">Selecciona otra fecha o cambia los filtros</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail + Chart */}
        <div className="space-y-4">
          {/* Weekly Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Citas por Día</h3>
                </div>
                <Badge variant="gray" size="sm">Esta semana</Badge>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={weekChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip
                    contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    formatter={(value: number) => [`${value} citas`, 'Total']}
                    labelFormatter={(label: string) => {
                      const days: Record<string, string> = { Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles', Jue: 'Jueves', Vie: 'Viernes', Sáb: 'Sábado', Dom: 'Domingo' };
                      return days[label] || label;
                    }}
                  />
                  <Bar dataKey="citas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Doctors today */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Stethoscope size={14} className="text-blue-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Doctores del Día</h3>
              </div>
            </div>
            <div>
              {Array.from(new Set(dayAppointments.map(a => a.doctor))).map((doctor, i) => {
                const docAppts = dayAppointments.filter(a => a.doctor === doctor);
                const apt = docAppts[0];
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: apt?.color || '#6b7280' }}>
                      {doctor.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-900">{doctor}</p>
                      <p className="text-[9px] text-gray-500">{apt?.specialty}</p>
                    </div>
                    <span className="text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                      {docAppts.length} citas
                    </span>
                  </div>
                );
              })}
              {dayAppointments.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-[10px] text-gray-400">Sin doctores programados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cita Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Detalle de Cita</h2>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Info Row — same design as Citas del Día items */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex flex-col items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
                  <span className="text-sm font-bold text-blue-700 leading-none">{new Date(selectedAppointment.date).getDate()}</span>
                  <span className="text-[8px] font-medium text-blue-500 uppercase">{new Date(selectedAppointment.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                </div>
                <div className="flex-shrink-0 text-center">
                  <p className="text-[10px] font-bold text-gray-900">{selectedAppointment.time}</p>
                  <p className="text-[9px] text-gray-400">{selectedAppointment.duration}</p>
                </div>
                <div className="w-0.5 h-10 rounded-full flex-shrink-0 bg-blue-500" />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-blue-600">
                  {selectedAppointment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span onClick={() => { setSelectedAppointment(null); navigate(`/patients/${selectedAppointment.id}`); }} className="text-[10px] font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">{selectedAppointment.patient}</span>
                    <span className={`inline-flex items-center gap-0.5 text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${statusConfig[selectedAppointment.status].color}`}>{selectedAppointment.status}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-2">
                    <span onClick={() => { setSelectedAppointment(null); navigate(`/doctors/${selectedAppointment.id}`); }} className="flex items-center gap-0.5 hover:text-blue-600 hover:underline cursor-pointer"><Stethoscope size={9} />{selectedAppointment.doctor}</span>
                    <span>·</span>
                    <span>{selectedAppointment.type}</span>
                    <span>·</span>
                    <span>{selectedAppointment.specialty}</span>
                  </p>
                </div>
              </div>

              {/* Observación */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <Eye size={12} className="text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900">Observación de la Cita</h3>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Paciente presenta presión arterial estable (120/80). Se mantiene medicación actual. Próximo control en 3 meses.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <button onClick={() => setSelectedAppointment(null)} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Cerrar
              </button>
              <div className="flex items-center gap-2">
                {selectedAppointment.status === 'Pendiente' && (
                  <>
                    <button onClick={() => { setSubModal({ type: 'cancel', aptId: selectedAppointment.id }); setSubModalText(''); }} className="px-3 py-1.5 text-[10px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => setSelectedAppointment(null)} className="px-3 py-1.5 text-[10px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Confirmar
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'Confirmada' && (
                  <>
                    <button onClick={() => { setSubModal({ type: 'cancel', aptId: selectedAppointment.id }); setSubModalText(''); }} className="px-3 py-1.5 text-[10px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => { setSubModal({ type: 'complete', aptId: selectedAppointment.id }); setSubModalText(''); }} className="px-3 py-1.5 text-[10px] font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Completar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: Cancel / Complete reason */}
      {subModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-200 ${subModal.type === 'cancel' ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${subModal.type === 'cancel' ? 'bg-red-100' : 'bg-green-100'}`}>
                  {subModal.type === 'cancel' ? <XCircle size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />}
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {subModal.type === 'cancel' ? 'Motivo de Cancelación' : 'Resultado de la Cita'}
                </h2>
              </div>
              <button onClick={() => setSubModal(null)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <textarea
                value={subModalText}
                onChange={(e) => setSubModalText(e.target.value)}
                placeholder={subModal.type === 'cancel' ? 'Describe el motivo de la cancelación...' : 'Describe el resultado de la cita...'}
                className="w-full h-32 px-3 py-2 text-xs text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-200 bg-gray-50 gap-2">
              <button onClick={() => setSubModal(null)} className="px-3 py-1.5 text-[10px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                Volver
              </button>
              <button
                onClick={() => { setSubModal(null); setSelectedAppointment(null); }}
                className={`px-3 py-1.5 text-[10px] font-medium text-white rounded-lg transition-colors ${subModal.type === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {subModal.type === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Resultado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
