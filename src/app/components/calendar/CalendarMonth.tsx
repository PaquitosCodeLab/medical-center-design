import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface CalendarMonthProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
}

export function CalendarMonth({ 
  appointments, 
  currentDate, 
  selectedDate,
  onDateClick, 
  onMonthChange,
  onTodayClick 
}: CalendarMonthProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
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

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onTodayClick}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Este mes
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMonthChange('prev')}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onMonthChange('next')}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
            Mes
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="px-3 py-2.5 text-center">
            <span className="text-xs font-semibold text-gray-600">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDay(day) : [];
          const isCurrentDay = day ? isToday(day) : false;
          const isSelectedDay = day ? isSelected(day) : false;

          return (
            <div
              key={index}
              className={`min-h-[120px] border-b border-r border-gray-100 p-2 ${
                day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50/30'
              } ${isSelectedDay ? 'bg-blue-50' : ''}`}
              onClick={() => day && onDateClick(new Date(year, month, day))}
            >
              {day && (
                <>
                  <div className="flex items-center justify-end mb-1.5">
                    <span className={`text-sm font-medium ${
                      isCurrentDay 
                        ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs' 
                        : isSelectedDay
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs px-2 py-1 rounded flex items-center gap-1.5`}
                        style={{ backgroundColor: apt.color + '20', color: apt.color }}
                      >
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: apt.color }}></div>
                        <span className="truncate font-medium">{apt.type}</span>
                        <span className="truncate opacity-75">{apt.patient.split(' ')[0]}</span>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2">
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