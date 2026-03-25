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

interface MonthViewProps {
  appointments: Appointment[];
  currentDate: Date;
  onDateClick: (date: Date) => void;
}

export function MonthView({ appointments, currentDate, onDateClick }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="px-2 py-3 text-center">
            <span className="text-xs font-medium text-gray-600">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDay(day) : [];
          const isCurrentDay = day ? isToday(day) : false;

          return (
            <div
              key={index}
              className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${
                day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50/50'
              }`}
              onClick={() => day && onDateClick(new Date(year, month, day))}
            >
              {day && (
                <>
                  <div className="flex items-center justify-center mb-1">
                    <span className={`text-xs font-medium ${
                      isCurrentDay 
                        ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center' 
                        : 'text-gray-900'
                    }`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs px-1.5 py-0.5 rounded truncate ${
                          apt.status === 'Confirmada'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {apt.time} {apt.patient}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 pl-1.5">
                        +{dayAppointments.length - 3} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
