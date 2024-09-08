"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface HourActivity {
  [key: string]: string;
}

interface HoursContextType {
  activities: HourActivity;
  handleActivityChange: (hourKey: string, value: string) => void;
}

const HoursContext = createContext<HoursContextType | undefined>(undefined);

export const useHours = () => {
  const context = useContext(HoursContext);
  if (!context) {
    throw new Error('useHours must be used within a HoursProvider');
  }
  return context;
};

interface HoursProviderProps {
  children: ReactNode;
}

export const HoursProvider: React.FC<HoursProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<HourActivity>({});

  const handleActivityChange = (hourKey: string, value: string): void => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [hourKey]: value
    }));
  };

  return (
    <HoursContext.Provider value={{ activities, handleActivityChange }}>
      {children}
    </HoursContext.Provider>
  );
};
