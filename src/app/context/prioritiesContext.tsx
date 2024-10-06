// /context/prioritiesContext.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

interface PrioritiesContextType {
  priorities: string[];
  setPriorities: React.Dispatch<React.SetStateAction<string[]>>;
}

const PrioritiesContext = createContext<PrioritiesContextType | undefined>(undefined);

export const PrioritiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const { selectedDate } = useDate();

  // Function to format the date as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  // Fetch priorities when the user is authenticated or when the selected date changes
  useEffect(() => {
    if (isLoading) return; // Wait until authentication state is initialized

    if (isAuthenticated && selectedDate) {
      const fetchPriorities = async () => {
        try {
          const response = await fetch(`/api/priorities?date=${formatDate(selectedDate)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPriorities(data.priorities);
          } else if (response.status === 401) {
            console.error('Unauthorized access. Logging out.');
            logout();
          } else {
            console.error('Failed to fetch priorities');
            setPriorities(['', '', '']);
          }
        } catch (error) {
          console.error('Error fetching priorities:', error);
          setPriorities(['', '', '']);
        }
      };
      fetchPriorities();
    } else {
      setPriorities(['', '', '']);
    }
  }, [isAuthenticated, isLoading, selectedDate, token, logout]);

  // Save priorities when they change
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const savePriorities = async () => {
        try {
          await fetch('/api/priorities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              date: formatDate(selectedDate),
              priorities,
            }),
          });
        } catch (error) {
          console.error('Error saving priorities:', error);
        }
      };
      savePriorities();
    }
  }, [priorities, isAuthenticated, isLoading, selectedDate, token]);

  return (
    <PrioritiesContext.Provider value={{ priorities, setPriorities }}>
      {children}
    </PrioritiesContext.Provider>
  );
};

export const usePriorities = () => {
  const context = useContext(PrioritiesContext);
  if (context === undefined) {
    throw new Error('usePriorities must be used within a PrioritiesProvider');
  }
  return context;
};
