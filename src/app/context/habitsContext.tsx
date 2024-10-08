// /context/habitsContext.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

interface Habit {
  name: string;
  completed: boolean;
}

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  toggleHabit: (index: number) => void;
  addHabit: (name: string) => void;
  deleteHabit: (index: number) => void;
}

const HabitsContext = React.createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const { selectedDate } = useDate();

  // Function to format the date as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  // Fetch habits when the user is authenticated or when the selected date changes
  useEffect(() => {
    if (isLoading) return; // Wait until authentication state is initialized

    if (isAuthenticated && selectedDate) {
      const fetchHabits = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/habits?date=${formatDate(selectedDate)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setHabits(data.habits);
          } else if (response.status === 401) {
            console.error('Unauthorized access. Logging out.');
            logout();
          } else {
            console.error('Failed to fetch habits');
          }
        } catch (error) {
          console.error('Error fetching habits:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchHabits();
    } else {
      setHabits([]);
    }
  }, [isAuthenticated, isLoading, selectedDate, token, logout]);

  // Save habits when they change
  useEffect(() => {
    if (isAuthenticated && selectedDate && !loading && !isLoading) {
      const saveHabits = async () => {
        try {
          const dateStr = formatDate(selectedDate);
          const todayStr = formatDate(new Date());

          const allEmpty = habits.length === 0;
          if (allEmpty) {
            // Delete habits from backend
            await fetch('/api/habits', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ date: dateStr }),
            });
          } else if (dateStr <= todayStr) {
            // Save habits to backend
            await fetch('/api/habits', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ habits, date: dateStr }),
            });
          }
        } catch (error) {
          console.error('Error saving habits:', error);
        }
      };
      saveHabits();
    }
  }, [habits, isAuthenticated, selectedDate, loading, isLoading, token]);

  const toggleHabit = (index: number) => {
    setHabits((prevHabits) => {
      const updatedHabits = [...prevHabits];
      updatedHabits[index].completed = !updatedHabits[index].completed;
      return updatedHabits;
    });
  };

  // Add a new habit
  const addHabit = (name: string) => {
    setHabits((prevHabits) => [...prevHabits, { name, completed: false }]);
  };

  // Delete a habit
  const deleteHabit = (index: number) => {
    setHabits((prevHabits) => {
      const updatedHabits = [...prevHabits];
      updatedHabits.splice(index, 1);
      return updatedHabits;
    });
  };

  return (
    <HabitsContext.Provider
      value={{ habits, loading, toggleHabit, addHabit, deleteHabit }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = React.useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
