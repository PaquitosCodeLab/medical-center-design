import { Users, Calendar, UserCheck, Activity, TrendingUp, TrendingDown, Clock, AlertCircle, UserPlus, FileText, Shield } from 'lucide-react';
import { useHeader } from '../components/HeaderContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Badge } from '../components/Badge';

// --- Mock Data ---
const monthlyConsultas = [
  { mes: 'Oct', consultas: 580 },
  { mes: 'Nov', consultas: 720 },
  { mes: 'Dic', consultas: 640 },
  { mes: 'Ene', consultas: 810 },
  { mes: 'Feb', consultas: 750 },
  { mes: 'Mar', consultas: 892 },
];

const departamentos = [
  { name: 'Cardiología', value: 310, color: '#2563eb' },
  { name: 'Pediatría', value: 245, color: '#3b82f6' },
  { name: 'Traumatología', value: 198, color: '#60a5fa' },
  { name: 'Dermatología', value: 156, color: '#93c5fd' },
  { name: 'Neurología', value: 125, color: '#bfdbfe' },
];

const citasPorDia = [
  { dia: 'Lun', citas: 38 },
  { dia: 'Mar', citas: 42 },
  { dia: 'Mié', citas: 35 },
  { dia: 'Jue', citas: 48 },
  { dia: 'Vie', citas: 44 },
  { dia: 'Sáb', citas: 22 },
  { dia: 'Dom', citas: 8 },
];

const topDoctores = [
  { name: 'Dr. López', especialidad: 'Cardiología', consultas: 128, initials: 'DL' },
  { name: 'Dra. Martínez', especialidad: 'Pediatría', consultas: 112, initials: 'DM' },
  { name: 'Dr. Sánchez', especialidad: 'Traumatología', consultas: 98, initials: 'DS' },
  { name: 'Dra. Torres', especialidad: 'Dermatología', consultas: 87, initials: 'DT' },
  { name: 'Dr. Ramírez', especialidad: 'Neurología', consultas: 76, initials: 'DR' },
];

const recentAppointments = [
  { id: 1, patient: 'María García', doctor: 'Dr. López', time: '09:00 AM', status: 'Confirmada' },
  { id: 2, patient: 'Juan Pérez', doctor: 'Dra. Martínez', time: '10:30 AM', status: 'Pendiente' },
  { id: 3, patient: 'Ana Rodríguez', doctor: 'Dr. Sánchez', time: '11:00 AM', status: 'Confirmada' },
  { id: 4, patient: 'Carlos Díaz', doctor: 'Dra. Torres', time: '02:00 PM', status: 'Cancelada' },
];

const actividadReciente = [
  { id: 1, icon: UserPlus, text: 'Nuevo paciente registrado', detail: 'María García López', time: 'Hace 12 min', color: 'bg-blue-100 text-blue-600' },
  { id: 2, icon: Calendar, text: 'Cita confirmada', detail: 'Juan Pérez — Dr. López', time: 'Hace 25 min', color: 'bg-blue-100 text-blue-600' },
  { id: 3, icon: FileText, text: 'Historia clínica actualizada', detail: 'Ana Rodríguez', time: 'Hace 40 min', color: 'bg-blue-100 text-blue-600' },
  { id: 4, icon: Shield, text: 'Rol asignado', detail: 'Dr. Sánchez → Cardiólogo', time: 'Hace 1h', color: 'bg-blue-100 text-blue-600' },
  { id: 5, icon: AlertCircle, text: 'Cita cancelada', detail: 'Carlos Díaz — Dra. Torres', time: 'Hace 2h', color: 'bg-red-100 text-red-600' },
];

const sparkData = {
  pacientes: [65, 72, 68, 80, 75, 90, 85, 95, 88, 100],
  citas: [30, 35, 28, 40, 38, 45, 42, 48, 44, 42],
  doctores: [15, 16, 15, 17, 16, 18, 17, 18, 18, 18],
  consultas: [70, 75, 68, 82, 78, 90, 85, 92, 88, 95],
};

const stats = [
  { title: 'Total Pacientes', value: '1,234', change: '+12.5%', trend: 'up' as const, icon: Users, spark: sparkData.pacientes },
  { title: 'Citas Hoy', value: '42', change: '+8.2%', trend: 'up' as const, icon: Calendar, spark: sparkData.citas },
  { title: 'Doctores Activos', value: '18', change: '-2.4%', trend: 'down' as const, icon: UserCheck, spark: sparkData.doctores },
  { title: 'Consultas Mes', value: '892', change: '+15.3%', trend: 'up' as const, icon: Activity, spark: sparkData.consultas },
];

// --- Custom Tooltip ---
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
      <p className="text-[10px] font-medium text-gray-500 mb-0.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs font-semibold text-gray-900">
          {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function Dashboard() {
  useHeader({ title: 'Dashboard', subtitle: 'Resumen general del centro médico' });
  const totalDept = departamentos.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">


      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const sparkline = stat.spark.map((v, i) => ({ v, i }));
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 mb-0.5">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900 leading-none">{stat.value}</p>
                </div>
                <div className="w-20 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkline}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={stat.trend === 'up' ? '#3b82f6' : '#ef4444'}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Area Chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Activity size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Consultas por Mes</h3>
              <Badge variant="gray" size="sm" className="ml-auto">Últimos 6 meses</Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyConsultas} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="consultas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#blueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Por Departamento</h3>
            </div>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departamentos}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {departamentos.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{totalDept}</span>
                <span className="text-[10px] text-gray-500">Total</span>
              </div>
            </div>
            <div className="w-full mt-3 space-y-1.5">
              {departamentos.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-gray-700">{d.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Bar Chart + Top Doctores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Citas por Día</h3>
              <Badge variant="gray" size="sm" className="ml-auto">Esta semana</Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={citasPorDia} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="citas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Doctores */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <UserCheck size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Top Doctores</h3>
              <Badge variant="gray" size="sm" className="ml-auto">Este mes</Badge>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            {topDoctores.map((doc, index) => {
              const maxConsultas = topDoctores[0].consultas;
              const pct = (doc.consultas / maxConsultas) * 100;
              return (
                <div key={doc.name} className="flex items-center gap-2.5">
                  <span className="text-[10px] font-semibold text-gray-400 w-3 text-right">{index + 1}</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[10px] font-medium text-gray-900 truncate">{doc.name}</p>
                      <span className="text-[10px] font-semibold text-blue-600 ml-2">{doc.consultas}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{doc.especialidad}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Appointments + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar size={14} className="text-blue-600" />
              </div>
              <h2 className="text-xs font-semibold text-gray-900">Próximas Citas</h2>
              <Badge variant="gray" size="sm" className="ml-auto">{recentAppointments.length}</Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2.5">
              {recentAppointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">
                      {a.patient.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{a.patient}</p>
                      <p className="text-[10px] text-gray-500">{a.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500">{a.time}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      a.status === 'Confirmada'
                        ? 'bg-green-100 text-green-700'
                        : a.status === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Clock size={14} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {actividadReciente.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="relative flex-shrink-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.color}`}>
                        <ItemIcon size={13} />
                      </div>
                      {index < actividadReciente.length - 1 && (
                        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-3 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-gray-900">{item.text}</p>
                      <p className="text-[10px] text-gray-500 truncate">{item.detail}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
