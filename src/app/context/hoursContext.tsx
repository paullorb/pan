"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface HourActivity {
  [key: string]: string;
}

interface HoursContextType {
  activities: HourActivity;
  from: number;
  until: number;
  handleActivityChange: (hourKey: string, value: string) => void;
  setFrom: (from: number) => void;
  setUntil: (until: number) => void;
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
  const [from, setFrom] = useState<number>(5); // Default starting hour
  const [until, setUntil] = useState<number>(23); // Default ending hour

  const handleActivityChange = (hourKey: string, value: string): void => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [hourKey]: value
    }));
  };

  return (
    <HoursContext.Provider value={{ activities, from, until, handleActivityChange, setFrom, setUntil }}>
      {children}
    </HoursContext.Provider>
  );
};
