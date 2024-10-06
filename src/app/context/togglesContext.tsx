// /components/context/togglesContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from './authContext';

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
  const { isAuthenticated } = useAuth();

  // Initialize togglesState from localStorage or use defaults
  const [togglesState, setTogglesState] = useState<TogglesState>(() => {
    if (typeof window !== "undefined") {
      const storedToggles = localStorage.getItem('togglesState');
      return storedToggles ? JSON.parse(storedToggles) : {
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
      if (typeof window !== "undefined") {
        localStorage.setItem('togglesState', JSON.stringify(togglesState));
      }
    }, [togglesState]);

  // Save togglesState when it changes
  useEffect(() => {
    if (isAuthenticated) {
      const saveTogglesState = async () => {
        try {
          await fetch('/api/toggles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ togglesState }),
          });
        } catch (error) {
          console.error('Error saving toggles state:', error);
        }
      };
      saveTogglesState();
    }
  }, [togglesState, isAuthenticated]);

  return (
    <TogglesContext.Provider value={{ togglesState, setTogglesState }}>
      {children}
    </TogglesContext.Provider>
  );
};
