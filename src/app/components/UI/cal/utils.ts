export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dd = day < 10 ? `0${day}` : day;
  const mm = month < 10 ? `0${month}` : month;
  return `${dd}.${mm}.${year}`;
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

export type Cell = {
  date: Date;
  inCurrentMonth: boolean;
};

export const getCalendarWeeks = (date: Date): Cell[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Adjust so that Monday is the first day of the week
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  const cells: Cell[] = [];
  if (startDay > 0) {
    const lastDatePrevMonth = new Date(year, month, 0).getDate();
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();
    for (let i = 0; i < startDay; i++) {
      const day = lastDatePrevMonth - startDay + i + 1;
      const cellDate = new Date(prevYear, prevMonth, day);
      cells.push({ date: cellDate, inCurrentMonth: false });
    }
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    cells.push({ date: cellDate, inCurrentMonth: true });
  }
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
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
};
