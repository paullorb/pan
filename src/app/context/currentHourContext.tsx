// context/currentHourContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrentHourContextType {
  currentHour: number | null;
  currentMinutes: number | null;
}

const CurrentHourContext = createContext<CurrentHourContextType | undefined>(undefined);

export const CurrentHourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinutes(now.getMinutes());
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CurrentHourContext.Provider value={{ currentHour, currentMinutes }}>
      {children}
    </CurrentHourContext.Provider>
  );
};

export const useCurrentHour = () => {
  const context = useContext(CurrentHourContext);
  if (!context) {
    throw new Error('useCurrentHour must be used within a CurrentHourProvider');
  }
  return context;
};
