interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  type: string;
  specialty: string;
}

interface DayViewProps {
  appointments: Appointment[];
  currentDate: Date;
}

export function DayView({ appointments, currentDate }: DayViewProps) {
  const dateStr = currentDate.toISOString().split('T')[0];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const getAppointmentsForHour = (hour: number) => {
    return appointments.filter(apt => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.time.split(':')[0]);
      const isPM = apt.time.includes('PM');
      const hour24 = isPM && aptHour !== 12 ? aptHour + 12 : aptHour;
      return hour24 === hour;
    });
  };

  const dayAppointments = appointments.filter(apt => apt.date === dateStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeline */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">
              {currentDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {hours.map((hour) => {
              const hourAppointments = getAppointmentsForHour(hour);
              return (
                <div key={hour} className="flex border-b border-gray-100">
                  <div className="w-24 px-4 py-4 text-xs text-gray-500 border-r border-gray-200 flex-shrink-0">
                    {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </div>
                  <div className="flex-1 px-4 py-3 min-h-[80px] hover:bg-gray-50">
                    <div className="space-y-2">
                      {hourAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-3 rounded-lg border ${
                            apt.status === 'Confirmada'
                              ? 'bg-green-50 border-green-200'
                              : apt.status === 'Pendiente'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-medium text-sm text-gray-900">{apt.patient}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              apt.status === 'Confirmada'
                                ? 'bg-green-100 text-green-700'
                                : apt.status === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <div>{apt.time} - {apt.doctor}</div>
                            <div>{apt.specialty} · {apt.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Resumen del Día</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Total de Citas</span>
              <span className="text-sm font-semibold text-gray-900">{dayAppointments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Confirmadas</span>
              <span className="text-sm font-semibold text-green-600">
                {dayAppointments.filter(a => a.status === 'Confirmada').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Pendientes</span>
              <span className="text-sm font-semibold text-yellow-600">
                {dayAppointments.filter(a => a.status === 'Pendiente').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Canceladas</span>
              <span className="text-sm font-semibold text-red-600">
                {dayAppointments.filter(a => a.status === 'Cancelada').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Próximas Citas</h3>
          <div className="space-y-2">
            {dayAppointments
              .filter(a => a.status !== 'Cancelada')
              .slice(0, 5)
              .map((apt) => (
                <div key={apt.id} className="py-2 border-b border-gray-100 last:border-0">
                  <div className="text-xs font-medium text-gray-900">{apt.time}</div>
                  <div className="text-xs text-gray-600">{apt.patient}</div>
                  <div className="text-xs text-gray-500">{apt.doctor}</div>
                </div>
              ))}
            {dayAppointments.filter(a => a.status !== 'Cancelada').length === 0 && (
              <p className="text-xs text-gray-500">No hay citas programadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
