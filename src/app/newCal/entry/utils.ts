export const getDateKey = (date: Date): string => {
  // Returns date in the format YYYY-MM-DD
  return date.toLocaleDateString("en-CA");
};
