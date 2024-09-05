"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface HourActivity {
  [key: string]: string; // Using an index signature to describe a dictionary of hour keys to activity descriptions.
}

interface HoursContextType {
  activities: HourActivity;
  handleActivityChange: (hourKey: string, value: string) => void;
}

const HoursContext = createContext<HoursContextType | undefined>(undefined); // Defining context with undefined initial value for strict mode compliance.

export const useHours = () => {
  const context = useContext(HoursContext);
  if (!context) {
    throw new Error('useHours must be used within a HoursProvider');
  }
  return context;
};

interface HoursProviderProps {
  children: ReactNode; // ReactNode allows any valid React child, including null, string, and React elements.
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
