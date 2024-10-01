// context/currentHourContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrentHourContextType {
  currentHour: number | null;
}

const CurrentHourContext = createContext<CurrentHourContextType | undefined>(undefined);

export const CurrentHourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date();
      const nowHour = now.getHours();
      setCurrentHour(nowHour);
    };

    updateCurrentHour();
    const intervalId = setInterval(updateCurrentHour, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CurrentHourContext.Provider value={{ currentHour }}>
      {children}
    </CurrentHourContext.Provider>
  );
};

export const useCurrentHour = () => {
  const context = useContext(CurrentHourContext);
  if (context === undefined) {
    throw new Error('useCurrentHour must be used within a CurrentHourProvider');
  }
  return context;
};
