"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Item {
  text: string;
  context: string | null;
}

interface ItemsContextType {
  items: { [date: string]: Item[] };
  addItem: (date: string, text: string) => Promise<void>;
  updateItemContext: (date: string, index: number, context: string | null) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<{ [date: string]: Item[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = async (date: string, text: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newEntry = { date, text, context: null };
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) {
        throw new Error("Failed to save entry");
      }
      setItems((prev) => {
        const prevList = prev[date] || [];
        return { ...prev, [date]: [...prevList, { text, context: null }] };
      });
    } catch (error) {
      console.error("Error in addItem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItemContext = (date: string, index: number, context: string | null) => {
    setItems((prev) => {
      const prevList = prev[date] || [];
      const newList = [...prevList];
      if (newList[index]) {
        newList[index] = { ...newList[index], context };
      }
      return { ...prev, [date]: newList };
    });
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItemContext }}>
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
