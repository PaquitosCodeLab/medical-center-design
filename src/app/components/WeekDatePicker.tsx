import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getWeekDays(date: Date) {
  const start = new Date(date);
  const dow = start.getDay();
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface WeekDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointmentCounts?: Record<string, number>;
}

export function WeekDatePicker({ selectedDate, onDateChange, appointmentCounts = {} }: WeekDatePickerProps) {
  const weekDays = getWeekDays(selectedDate);
  const selectedStr = toDateStr(selectedDate);
  const todayStr = toDateStr(new Date());

  const navigateWeek = (dir: 'prev' | 'next') => {
    if (dir === 'next') {
      const nextMonday = new Date(weekDays[0]);
      nextMonday.setDate(nextMonday.getDate() + 7);
      onDateChange(nextMonday);
    } else {
      const prevSunday = new Date(weekDays[0]);
      prevSunday.setDate(prevSunday.getDate() - 1);
      onDateChange(prevSunday);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-100">
      <button onClick={() => navigateWeek('prev')} className="px-1.5 py-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
        <ChevronLeft size={12} />
      </button>

      <div className="flex-1 grid grid-cols-7">
        {weekDays.map((day, i) => {
          const dateStr = toDateStr(day);
          const isSelected = dateStr === selectedStr;
          const isToday = dateStr === todayStr;
          const count = appointmentCounts[dateStr] || 0;

          return (
            <button
              key={i}
              onClick={() => onDateChange(day)}
              className="flex items-center justify-center py-1.5 transition-all relative hover:bg-gray-50"
            >
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600'
              }`}>
                <span className={isSelected ? 'text-blue-200' : 'text-gray-400'}>{dayNames[i]}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>{day.getDate()}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-semibold w-3.5 h-3.5 flex items-center justify-center rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>{count}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <button onClick={() => navigateWeek('next')} className="px-1.5 py-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

// Month badge with calendar popover — to be placed in the card header
interface MonthCalendarBadgeProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthCalendarBadge({ selectedDate, onDateChange }: MonthCalendarBadgeProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const [calMonth, setCalMonth] = useState(selectedDate.getMonth());
  const [calYear, setCalYear] = useState(selectedDate.getFullYear());

  const selectedStr = toDateStr(selectedDate);
  const todayStr = toDateStr(new Date());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalendarOpen(false);
    };
    if (calendarOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [calendarOpen]);

  const calDays = () => {
    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const days: (Date | null)[] = Array.from({ length: startDow }, () => null);
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(calYear, calMonth, i));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  return (
    <div className="relative inline-flex items-center" ref={calRef}>
      <button
        onClick={() => { setCalMonth(selectedDate.getMonth()); setCalYear(selectedDate.getFullYear()); setCalendarOpen(!calendarOpen); }}
        className="text-[10px] font-medium text-white bg-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        {monthNames[selectedDate.getMonth()].slice(0, 3)} {selectedDate.getFullYear()}
      </button>

      {calendarOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="p-0.5 text-gray-500 hover:text-gray-700 rounded transition-colors">
              <ChevronLeft size={12} />
            </button>
            <span className="text-[10px] font-semibold text-gray-900">{monthNames[calMonth]} {calYear}</span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="p-0.5 text-gray-500 hover:text-gray-700 rounded transition-colors">
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-7 px-2 pt-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 px-2 pb-2">
            {calDays().map((day, i) => {
              if (!day) return <div key={i} />;
              const dStr = toDateStr(day);
              const isSel = dStr === selectedStr;
              const isT = dStr === todayStr;
              return (
                <button
                  key={i}
                  onClick={() => { onDateChange(day); setCalendarOpen(false); }}
                  className={`text-[10px] py-1 rounded-md transition-colors ${
                    isSel ? 'bg-blue-600 text-white font-bold' : isT ? 'text-blue-600 font-bold hover:bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
