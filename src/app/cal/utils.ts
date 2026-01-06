/**
 * Utility functions for calendar-related formatting and calculations.
 */

export const formatDate = (date: Date): string => {
  // Use padStart to ensure two-digit day and month formatting.
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

export const DAY_THRESHOLD = 50;
export const MONTH_THRESHOLD = 50;
export const WEEKDAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAY_HEADER_LENGTH = 1;

export type Cell = {
  date: Date;
  inCurrentMonth: boolean;
};

export const getCalendarWeeks = (date: Date): Cell[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Determine the first day of the month and the number of days in the month.
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust start day so that Monday is index 0 and Sunday is index 6.
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  const cells: Cell[] = [];

  // Fill in cells for the previous month's trailing days.
  if (startDay > 0) {
    const lastDatePrevMonth = new Date(year, month, 0).getDate();
    // Calculate previous month and year 
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    for (let i = 0; i < startDay; i++) {
      const day = lastDatePrevMonth - startDay + i + 1;
      const cellDate = new Date(prevYear, prevMonth, day);
      cells.push({ date: cellDate, inCurrentMonth: false });
    }
  }

  // Fill in cells for the current month.
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    cells.push({ date: cellDate, inCurrentMonth: true });
  }

  // Fill in cells for the next month's leading days to complete the final week.
  const remaining = cells.length % 7;
  if (remaining > 0) {
    const daysToAdd = 7 - remaining;
    const nextMonthDate = new Date(year, month + 1, 1);
    const nextMonth = nextMonthDate.getMonth();
    const nextYear = nextMonthDate.getFullYear();

    for (let i = 1; i <= daysToAdd; i++) {
      const cellDate = new Date(nextYear, nextMonth, i);
      cells.push({ date: cellDate, inCurrentMonth: false });
    }
  }

  // Group cells into weeks.
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
};
