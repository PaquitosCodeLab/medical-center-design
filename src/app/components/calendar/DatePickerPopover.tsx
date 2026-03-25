import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface DatePickerPopoverProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DatePickerPopover({ selectedDate, onDateSelect }: DatePickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  
  // Previous month days
  const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push(prevMonthLastDay - i);
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           viewMonth === today.getMonth() && 
           viewYear === today.getFullYear();
  };

  const isSelected = (day: number | null) => {
    if (!day) return false;
    return day === selectedDate.getDate() && 
           viewMonth === selectedDate.getMonth() && 
           viewYear === selectedDate.getFullYear();
  };

  const handleDateClick = (day: number | null, isCurrentMonth: boolean) => {
    if (!day) return;
    
    let targetMonth = viewMonth;
    let targetYear = viewYear;

    if (!isCurrentMonth) {
      const dayIndex = calendarDays.indexOf(day);
      if (dayIndex < 7) {
        // Previous month
        targetMonth = viewMonth === 0 ? 11 : viewMonth - 1;
        targetYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      } else {
        // Next month
        targetMonth = viewMonth === 11 ? 0 : viewMonth + 1;
        targetYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      }
    }

    const newDate = new Date(targetYear, targetMonth, day);
    onDateSelect(newDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    } else {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => viewYear - 5 + i);

  const isDayInCurrentMonth = (index: number) => {
    return index >= startingDayOfWeek && index < startingDayOfWeek + daysInMonth;
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
      >
        <span className="text-sm font-medium text-gray-900">
          {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigateMonth('next')}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isDayInCurrentMonth(index);
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day, isCurrentMonth)}
                  className={`
                    h-9 flex items-center justify-center rounded-lg text-sm transition-colors
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isSelectedDay ? 'bg-blue-600 text-white font-semibold' : ''}
                    ${isCurrentDay && !isSelectedDay ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                    ${!isSelectedDay && !isCurrentDay && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}