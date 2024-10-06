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

  // Set default togglesState to have all toggles activated
  const [togglesState, setTogglesState] = useState<TogglesState>({
    hours: true,
    priorities: true,
    tasks: true,
    month: true,
    habits: true,
    tags: true,
  });

  // Fetch togglesState when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTogglesState = async () => {
        try {
          const response = await fetch('/api/toggles', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setTogglesState(data.togglesState);
          } else {
            console.error('Failed to fetch toggles state');
          }
        } catch (error) {
          console.error('Error fetching toggles state:', error);
        }
      };
      fetchTogglesState();
    }
  }, [isAuthenticated]);

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
