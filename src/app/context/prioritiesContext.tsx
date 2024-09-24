/* eslint-disable react-hooks/exhaustive-deps */
// prioritiesContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

interface PrioritiesContextType {
  priorities: string[];
  setPriorities: React.Dispatch<React.SetStateAction<string[]>>;
}

const PrioritiesContext = createContext<PrioritiesContextType | undefined>(undefined);

export const PrioritiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const { isAuthenticated } = useAuth();
  const { selectedDate } = useDate();
  const isFirstLoad = useRef(true);

  // Function to format the date as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fetch priorities when the user is authenticated or when the selected date changes
  useEffect(() => {
    if (isAuthenticated && selectedDate) {
      // Fetch priorities from backend
      const fetchPriorities = async () => {
        try {
          const response = await fetch(`/api/priorities?date=${formatDate(selectedDate)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPriorities(data.priorities);
          } else {
            console.error('Failed to fetch priorities');
            setPriorities(['', '', '']); // Reset priorities if fetch fails
          }
        } catch (error) {
          console.error('Error fetching priorities:', error);
          setPriorities(['', '', '']); // Reset priorities if error occurs
        } finally {
          isFirstLoad.current = false; // Mark that the first load is complete
        }
      };
      fetchPriorities();
    } else {
      setPriorities(['', '', '']);
      isFirstLoad.current = false;
    }
  }, [isAuthenticated, selectedDate]);

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
