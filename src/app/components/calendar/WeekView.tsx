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

interface WeekViewProps {
  appointments: Appointment[];
  currentDate: Date;
}

export function WeekView({ appointments, currentDate }: WeekViewProps) {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const getAppointmentsForDayAndHour = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.time.split(':')[0]);
      const isPM = apt.time.includes('PM');
      const hour24 = isPM && aptHour !== 12 ? aptHour + 12 : aptHour;
      return hour24 === hour;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 sticky top-0">
        <div className="px-2 py-3"></div>
        {weekDays.map((date, index) => (
          <div key={index} className="px-2 py-3 text-center border-l border-gray-200">
            <div className="text-xs text-gray-500 mb-1">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][index]}
            </div>
            <div className={`text-sm font-medium ${
              isToday(date) 
                ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto' 
                : 'text-gray-900'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
            <div className="px-2 py-4 text-xs text-gray-500 border-r border-gray-200">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
            {weekDays.map((date, dayIndex) => {
              const dayAppointments = getAppointmentsForDayAndHour(date, hour);
              return (
                <div
                  key={dayIndex}
                  className="px-2 py-4 min-h-[60px] border-l border-gray-100 hover:bg-gray-50"
                >
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`text-xs px-2 py-1 rounded mb-1 ${
                        apt.status === 'Confirmada'
                          ? 'bg-green-100 text-green-700'
                          : apt.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <div className="font-medium truncate">{apt.patient}</div>
                      <div className="text-xs opacity-75">{apt.doctor}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
