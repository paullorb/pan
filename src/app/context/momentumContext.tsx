// momentumContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the Habit interface
interface Habit {
  name: string;
  completed: boolean;
}

// Define the context type
interface MomentumContextType {
  habits: Habit[];
  toggleHabit: (index: number) => void;
}

// Create the context
const MomentumContext = createContext<MomentumContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useMomentum = () => {
  const context = useContext(MomentumContext);
  if (!context) {
    throw new Error("useMomentum must be used within a MomentumProvider");
  }
  return context;
};

// Create the provider component
interface MomentumProviderProps {
  children: ReactNode;
}

export const MomentumProvider: React.FC<MomentumProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([
    { name: '🍞 Physio Übungen', completed: false },
    { name: '🍞 Duolingo', completed: false }
  ]);

  const toggleHabit = (index: number) => {
    setHabits((prevHabits) => {
      const updatedHabits = [...prevHabits];
      updatedHabits[index].completed = !updatedHabits[index].completed;
      return updatedHabits;
    });
  };

  return (
    <MomentumContext.Provider value={{ habits, toggleHabit }}>
      {children}
    </MomentumContext.Provider>
  );
};
