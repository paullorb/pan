"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CalendarContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dayScrollAccum: number;
  setDayScrollAccum: (accum: number) => void;
  monthScrollAccum: number;
  setMonthScrollAccum: (accum: number) => void;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialToday = new Date();
  const [selectedDate, setSelectedDate] = useState(initialToday);
  const [dayScrollAccum, setDayScrollAccum] = useState(0);
  const [monthScrollAccum, setMonthScrollAccum] = useState(0);

  const addDays = (date: Date, days: number): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

  const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    const newDay = Math.min(date.getDate(), daysInNewMonth);
    return new Date(newDate.getFullYear(), newDate.getMonth(), newDay);
  };

  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevMonth = () => setSelectedDate(addMonths(selectedDate, -1));
  const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        dayScrollAccum,
        setDayScrollAccum,
        monthScrollAccum,
        setMonthScrollAccum,
        handlePrevDay,
        handleNextDay,
        handlePrevMonth,
        handleNextMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
