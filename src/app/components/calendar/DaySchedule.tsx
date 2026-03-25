import { Calendar } from 'lucide-react';

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

interface DayScheduleProps {
  appointments: Appointment[];
  selectedDate: Date;
}

export function DaySchedule({ appointments, selectedDate }: DayScheduleProps) {
  const dateStr = selectedDate.toISOString().split('T')[0];
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 7 PM

  const getAppointmentsForHour = (hour: number) => {
    return appointments.filter(apt => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.time.split(':')[0]);
      const isPM = apt.time.includes('PM');
      const hour24 = isPM && aptHour !== 12 ? aptHour + 12 : !isPM && aptHour === 12 ? 0 : aptHour;
      return hour24 === hour;
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0 && diffHours === 0 && diffMins > 0) {
      return `en ${diffMins} minutos`;
    } else if (diffDays === 0 && diffHours > 0) {
      return `en ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'mañana';
    } else if (diffDays > 1) {
      return `en ${diffDays} días`;
    } else {
      return 'pasado';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Calendar size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {selectedDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h3>
          <p className="text-xs text-gray-500">
            {formatTime(selectedDate)}
          </p>
        </div>
      </div>

      {/* Schedule */}
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        {hours.map((hour) => {
          const hourAppointments = getAppointmentsForHour(hour);
          const timeLabel = hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;

          return (
            <div key={hour} className="flex border-b border-gray-100">
              <div className="w-20 px-3 py-3 text-xs text-gray-500 flex-shrink-0 border-r border-gray-100">
                {timeLabel}
              </div>
              <div className="flex-1 px-3 py-2 min-h-[60px]">
                <div className="space-y-2">
                  {hourAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-lg border-l-4"
                      style={{ 
                        backgroundColor: apt.color + '15',
                        borderLeftColor: apt.color 
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: apt.color }}
                          ></div>
                          <span className="text-sm font-semibold text-gray-900">{apt.type}</span>
                        </div>
                        <span className="text-xs text-gray-500">{apt.time}</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-0.5 ml-4">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{apt.patient}</span>
                        </div>
                        <div>{apt.doctor} · {apt.specialty}</div>
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
  );
}