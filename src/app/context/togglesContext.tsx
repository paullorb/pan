"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface TogglesState {
  // Component toggles
  hours: boolean;
  priorities: boolean;
  tasks: boolean;
  month: boolean;
  habits: boolean;
  tags: boolean;
  // Layout toggles
  main: boolean;
  aside: boolean;
}

interface TogglesContextType {
  togglesState: TogglesState;
  setTogglesState: React.Dispatch<React.SetStateAction<TogglesState>>;
  isInitialized: boolean;
}

export const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

export const TogglesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [togglesState, setTogglesState] = useState<TogglesState>({
    // Component toggles
    hours: false,
    priorities: true,
    tasks: true,
    month: true,
    habits: true,
    tags: true,
    // Layout toggles
    main: true,
    aside: true,
  });

  useEffect(() => {
    const storedToggles = localStorage.getItem('togglesState');
    if (storedToggles) {
      setTogglesState(JSON.parse(storedToggles));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('togglesState', JSON.stringify(togglesState));
    }
  }, [togglesState, isInitialized]);

  return (
    <TogglesContext.Provider value={{ togglesState, setTogglesState, isInitialized }}>
      {children}
    </TogglesContext.Provider>
  );
};