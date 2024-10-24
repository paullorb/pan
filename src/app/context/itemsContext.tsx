// context/itemsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

// Define types for different item categories
export type ItemType = 'priority' | 'task' | 'habit' | 'hour';

interface Item {
  id?: string;
  text: string;
  type: ItemType;
  completed?: boolean;
  order?: number;
}

interface ItemsContextType {
  items: Record<ItemType, Item[]>;
  updateItem: (type: ItemType, index: number, newValue: string) => void;
  toggleItem?: (type: ItemType, index: number) => void;
  deleteItem?: (type: ItemType, index: number) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    priority: [
      { text: '', type: 'priority', order: 0 },
      { text: '', type: 'priority', order: 1 },
      { text: '', type: 'priority', order: 2 },
    ],
    task: [],
    habit: [],
    hour: [],
  });

  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const { selectedDate } = useDate();

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  // Fetch items of a specific type
  const fetchItems = async (type: ItemType) => {
    if (!isAuthenticated || isLoading) return;

    try {
      const response = await fetch(
        `/api/${type}s?date=${formatDate(selectedDate)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItems(prev => ({
          ...prev,
          [type]: data[`${type}s`].map((item: any) => ({
            ...item,
            type,
          })),
        }));
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    }
  };

  // Save items of a specific type
  const saveItems = async (type: ItemType) => {
    if (!isAuthenticated || isLoading) return;

    try {
      await fetch(`/api/${type}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formatDate(selectedDate),
          [`${type}s`]: items[type],
        }),
      });
    } catch (error) {
      console.error(`Error saving ${type}s:`, error);
    }
  };

  // Fetch priorities when authenticated or date changes
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchItems('priority');
    }
  }, [isAuthenticated, isLoading, selectedDate]);

  // Save priorities when they change
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      saveItems('priority');
    }
  }, [items.priority]);

  const updateItem = (type: ItemType, index: number, newValue: string) => {
    setItems(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, text: newValue } : item
      ),
    }));
  };

  return (
    <ItemsContext.Provider value={{ items, updateItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};