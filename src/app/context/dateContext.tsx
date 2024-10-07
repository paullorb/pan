// /context/dateContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

// Type definition for the context's value
interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

// Creating the context with a default value (will be set in the provider)
const DateContext = createContext<DateContextType | undefined>(undefined);

// Provider component
export const DateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

// Custom hook to use the date context
export const useDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};

// Function to return selected date in classic format
export const getFormattedDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to get correct month number
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Return in classic format DD/MM/YYYY
};
