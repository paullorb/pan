// context/momentumContext.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

interface Habit {
  name: string;
  completed: boolean;
}

interface MomentumContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  toggleHabit: (index: number) => void;
  addHabit: (name: string) => void;          // New function
  deleteHabit: (index: number) => void;      // New function
}

const MomentumContext = createContext<MomentumContextType | undefined>(
  undefined
);

export const MomentumProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { isAuthenticated } = useAuth();
  const { selectedDate } = useDate();
  const isFirstLoad = useRef(true);

  // Function to format the date as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fetch habits when the user is authenticated or when the selected date changes
  useEffect(() => {
    if (isAuthenticated && selectedDate) {
      const fetchHabits = async () => {
        try {
          const response = await fetch(
            `/api/momentum?date=${formatDate(selectedDate)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setHabits(data.habits);
          } else {
            console.error('Failed to fetch habits');
            setHabits([]); // Reset habits if fetch fails
          }
        } catch (error) {
          console.error('Error fetching habits:', error);
          setHabits([]); // Reset habits if error occurs
        } finally {
          isFirstLoad.current = false; // Mark that the first load is complete
        }
      };
      fetchHabits();
    } else {
      setHabits([]);
      isFirstLoad.current = false;
    }
  }, [isAuthenticated, selectedDate]);

  useEffect(() => {
    if (isAuthenticated && selectedDate && !isFirstLoad.current) {
      const saveHabits = async () => {
        try {
          const dateStr = formatDate(selectedDate);
          const todayStr = formatDate(new Date());
  
          const allEmpty = habits.length === 0;
          if (allEmpty) {
            // Delete habits from backend
            await fetch('/api/momentum', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ date: dateStr }),
            });
          } else if (dateStr <= todayStr) {
            // Save habits to backend
            await fetch('/api/momentum', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
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
  }, [habits]);

  const toggleHabit = (index: number) => {
    setHabits((prevHabits) => {
      const updatedHabits = [...prevHabits];
      updatedHabits[index].completed = !updatedHabits[index].completed;
      return updatedHabits;
    });
  };

  // Add a new habit
  const addHabit = (name: string) => {
    setHabits((prevHabits) => [
      ...prevHabits,
      { name, completed: false },
    ]);
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
    <MomentumContext.Provider
      value={{ habits, setHabits, toggleHabit, addHabit, deleteHabit }}
    >
      {children}
    </MomentumContext.Provider>
  );
};

export const useMomentum = () => {
  const context = useContext(MomentumContext);
  if (context === undefined) {
    throw new Error(
      'useMomentum must be used within a MomentumProvider'
    );
  }
  return context;
};
