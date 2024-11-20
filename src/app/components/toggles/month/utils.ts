// /utils/dateUtils.ts

/**
 * Returns the number of days in a given month of a specific year.
 * @param year The year (e.g., 2024).
 * @param month The month index (0 = January, 11 = December).
 * @returns The number of days in the given month.
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Returns the day of the week for the first day of a given month.
 * @param year The year (e.g., 2024).
 * @param month The month index (0 = January, 11 = December).
 * @returns The day of the week (0 = Sunday, 6 = Saturday).
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Checks if a given date is today.
 * @param date The date to check.
 * @returns True if the date is today, false otherwise.
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Formats a date to a string in the format YYYY-MM-DD.
 * @param date The date to format.
 * @returns A string representation of the date.
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Generates an array of day numbers for a given month, with null values for padding.
 * @param currentYear The year to generate days for.
 * @param currentMonth The month to generate days for.
 * @returns Array of day numbers with null padding for the start of the month.
 */
export const generateMonthDays = (currentYear: number, currentMonth: number): (number | null)[] => {
  const startingDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth) === 0
    ? 7
    : getFirstDayOfMonth(currentYear, currentMonth);
    
  const days: (number | null)[] = Array(startingDayOfWeek - 1).fill(null);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  return days;
};

/**
 * Fills remaining days in the calendar grid with null values.
 * @param days Array of day numbers and null values.
 * @param daysPerWeek Number of days in a week.
 * @returns Completed array with null padding at the end.
 */
export const fillRemainingDays = (days: (number | null)[], daysPerWeek: number): (number | null)[] => {
  const remainingCells = daysPerWeek - (days.length % daysPerWeek);
  if (remainingCells !== daysPerWeek) {
    return [...days, ...Array(remainingCells).fill(null)];
  }
  return days;
};