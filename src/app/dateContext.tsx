// src/contexts/dateContext.tsx
"use client";
import React, { createContext, useState, useContext } from 'react';

interface IDateContext {
  date: Date;
  incrementMonth: () => void;
  decrementMonth: () => void;
}

const DateContext = createContext<IDateContext | undefined>(undefined);

export const useDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [date, setDate] = useState(new Date());

  const incrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const decrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  return (
    <DateContext.Provider value={{ date, incrementMonth, decrementMonth }}>
      {children}
    </DateContext.Provider>
  );
};
