// /context/togglesContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface TogglesState {
  hours: boolean;
  priorities: boolean;
  tasks: boolean;
  month: boolean;
  habits: boolean;
  tags: boolean;
}

// Define the context type
interface TogglesContextType {
  togglesState: TogglesState;
  setTogglesState: React.Dispatch<React.SetStateAction<TogglesState>>;
}

// Create the context with default undefined value
export const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

export const TogglesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize togglesState from localStorage or use defaults
  const [togglesState, setTogglesState] = useState<TogglesState>(() => {
    if (typeof window !== 'undefined') {
      const storedToggles = localStorage.getItem('togglesState');
      return storedToggles
        ? JSON.parse(storedToggles)
        : {
            hours: true,
            priorities: true,
            tasks: true,
            month: true,
            habits: true,
            tags: true,
          };
    } else {
      // Default state if window is undefined (e.g., during server-side rendering)
      return {
        hours: true,
        priorities: true,
        tasks: true,
        month: true,
        habits: true,
        tags: true,
      };
    }
  });

  // Save togglesState to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('togglesState', JSON.stringify(togglesState));
    }
  }, [togglesState]);

  return (
    <TogglesContext.Provider value={{ togglesState, setTogglesState }}>
      {children}
    </TogglesContext.Provider>
  );
};
