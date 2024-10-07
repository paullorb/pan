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
