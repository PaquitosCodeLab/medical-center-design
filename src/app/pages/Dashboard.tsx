import { Users, Calendar, UserCheck, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../components/Badge';

export function Dashboard() {
  const stats = [
    {
      title: 'Total Pacientes',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Citas Hoy',
      value: '42',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'Doctores Activos',
      value: '18',
      change: '-2.4%',
      trend: 'down',
      icon: UserCheck,
      color: 'purple',
    },
    {
      title: 'Consultas',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Activity,
      color: 'orange',
    },
  ];

  const recentAppointments = [
    { id: 1, patient: 'María García', doctor: 'Dr. López', time: '09:00 AM', status: 'Confirmada' },
    { id: 2, patient: 'Juan Pérez', doctor: 'Dra. Martínez', time: '10:30 AM', status: 'Pendiente' },
    { id: 3, patient: 'Ana Rodríguez', doctor: 'Dr. Sánchez', time: '11:00 AM', status: 'Confirmada' },
    { id: 4, patient: 'Carlos Díaz', doctor: 'Dra. Torres', time: '02:00 PM', status: 'Cancelada' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 mb-0.5">Dashboard</h1>
        <p className="text-xs text-gray-500">Resumen general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          }[stat.color];

          return (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mb-1">{stat.title}</p>
              <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar size={14} className="text-blue-600" />
            </div>
            <h2 className="text-xs font-semibold text-gray-900">Próximas Citas</h2>
            <Badge variant="gray" size="sm" className="ml-auto">
              {recentAppointments.length}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-[10px] text-gray-500">{appointment.doctor}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-600">{appointment.time}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'Confirmada' 
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'Pendiente'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}