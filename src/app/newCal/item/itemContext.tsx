"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface WorkoutDetails {
  intensityOrWeight: string;
  repsAndSeries: string;
}

export interface Item {
  text: string;
  context: string | null;
  workoutDetails?: WorkoutDetails;
}

interface ItemsContextType {
  items: { [date: string]: Item[] };
  addItem: (date: string, text: string) => void;
  updateItemContext: (date: string, index: number, context: string | null) => void;
  updateItemWorkoutDetails: (date: string, index: number, details: WorkoutDetails) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<{ [date: string]: Item[] }>({});

  const addItem = useCallback((date: string, text: string) => {
    setItems(prev => {
      const prevList = prev[date] || [];
      return { ...prev, [date]: [...prevList, { text, context: null }] };
    });
  }, []);

  const updateItemContext = useCallback((date: string, index: number, context: string | null) => {
    setItems(prev => {
      const prevList = prev[date] || [];
      const newList = [...prevList];
      if (newList[index]) {
        newList[index] = { ...newList[index], context };
      }
      return { ...prev, [date]: newList };
    });
  }, []);

  const updateItemWorkoutDetails = useCallback((date: string, index: number, details: WorkoutDetails) => {
    setItems(prev => {
      const prevList = prev[date] || [];
      const newList = [...prevList];
      if (newList[index]) {
        const currentDetails = newList[index].workoutDetails;
        if (
          currentDetails &&
          currentDetails.intensityOrWeight === details.intensityOrWeight &&
          currentDetails.repsAndSeries === details.repsAndSeries
        ) {
          return prev;
        }
        newList[index] = { ...newList[index], workoutDetails: details };
      }
      return { ...prev, [date]: newList };
    });
  }, []);

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItemContext, updateItemWorkoutDetails }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
