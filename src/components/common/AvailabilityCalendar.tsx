import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { BookedDateRange } from '../../types';

interface AvailabilityCalendarProps {
  bookedRanges: BookedDateRange[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  onSelectRange?: (startDate: string, endDate: string) => void;
  interactive?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  bookedRanges,
  selectedStartDate,
  selectedEndDate,
  onSelectRange,
  interactive = true,
}) => {
  // Use October 2026 as the base demo month or current date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format date YYYY-MM-DD
  const formatDateString = (y: number, m: number, d: number) => {
    const monthStr = String(m + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    return `${y}-${monthStr}-${dayStr}`;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Helper to get today's date string YYYY-MM-DD
  const todayStr = formatDateString(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // Check if a date string is inside any booked range
  const isDateBooked = (dateStr: string): boolean => {
    for (const range of bookedRanges) {
      if (dateStr >= range.startDate && dateStr <= range.endDate) {
        return true;
      }
    }
    return false;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dateStr: string) => {
    if (!interactive || !onSelectRange) return;
    if (dateStr < todayStr) return; // Prevent selecting past dates
    if (isDateBooked(dateStr)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Starting new selection
      onSelectRange(dateStr, '');
    } else if (selectedStartDate && !selectedEndDate) {
      if (dateStr < selectedStartDate) {
        onSelectRange(dateStr, '');
      } else {
        // Check if any date in between is booked
        const [sY, sM, sD] = selectedStartDate.split('-').map(Number);
        const [eY, eM, eD] = dateStr.split('-').map(Number);
        let current = new Date(sY, sM - 1, sD);
        const end = new Date(eY, eM - 1, eD);
        let hasConflict = false;

        while (current <= end) {
          const dStr = formatDateString(current.getFullYear(), current.getMonth(), current.getDate());
          if (isDateBooked(dStr)) {
            hasConflict = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (!hasConflict) {
          onSelectRange(selectedStartDate, dateStr);
        } else {
          // Reset selection to clicked date because of conflict
          onSelectRange(dateStr, '');
        }
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-subtle">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-xs sm:text-sm text-slate-800">
            {monthNames[month]} {year}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-semibold text-slate-400 mb-1.5">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] sm:text-xs">
        {/* Empty slots for start of month */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8 sm:h-9 w-full" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const dateStr = formatDateString(year, month, dayNumber);
          const isBooked = isDateBooked(dateStr);

          const isStart = selectedStartDate === dateStr;
          const isEnd = selectedEndDate === dateStr;
          const isBetween =
            selectedStartDate &&
            selectedEndDate &&
            new Date(dateStr) > new Date(selectedStartDate) &&
            new Date(dateStr) < new Date(selectedEndDate);

          const isPast = dateStr < todayStr;
          let dayClasses = 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer font-medium';

          if (isPast) {
            dayClasses = 'text-slate-300 cursor-not-allowed opacity-40 bg-slate-50/50';
          } else if (isBooked) {
            dayClasses = 'bg-rose-50 text-rose-400 cursor-not-allowed line-through opacity-80';
          } else if (isStart || isEnd) {
            dayClasses = 'bg-indigo-600 text-white font-bold rounded-lg shadow-xs';
          } else if (isBetween) {
            dayClasses = 'bg-indigo-100 text-indigo-800 font-semibold';
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isBooked || isPast || !interactive}
              onClick={() => handleDayClick(dateStr)}
              className={`h-8 sm:h-9 w-full flex items-center justify-center rounded-lg transition-colors ${dayClasses}`}
              title={isPast ? 'Past date' : isBooked ? 'Already booked' : 'Available for borrowing'}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] text-slate-500 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 ring-2 ring-rose-100" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span>Past</span>
        </div>
      </div>

      {interactive && (
        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>Click start date, then return date to select borrowing window.</span>
        </div>
      )}
    </div>
  );
};

