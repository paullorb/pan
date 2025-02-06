"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ItemsContextType {
  items: { [date: string]: string[] };
  addItem: (date: string, item: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<{ [date: string]: string[] }>({});

  const addItem = (date: string, item: string) => {
    setItems((prev) => {
      const prevList = prev[date] || [];
      return { ...prev, [date]: [...prevList, item] };
    });
  };

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
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
