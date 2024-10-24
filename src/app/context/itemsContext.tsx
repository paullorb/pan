// context/itemsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

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
  loading: Record<ItemType, boolean>;
  updateItem: (type: ItemType, index: number, newValue: string) => void;
  toggleItem: (type: ItemType, index: number) => void;
  deleteItem: (type: ItemType, index: number) => void;
  addItem: (type: ItemType, text: string) => void;
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
  
  const [loading, setLoading] = useState<Record<ItemType, boolean>>({
    priority: false,
    task: false,
    habit: false,
    hour: false,
  });

  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const { selectedDate } = useDate();

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  const fetchItems = async (type: ItemType) => {
    if (!isAuthenticated || isLoading) return;

    setLoading(prev => ({ ...prev, [type]: true }));
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
        if (type === 'priority') {
          setItems(prev => ({
            ...prev,
            [type]: data.priorities.map((text: string, index: number) => ({
              text,
              type: 'priority',
              order: index
            }))
          }));
        } else if (type === 'habit') {
          const convertedItems = data.habits.map((habit: { name: string; completed: boolean }) => ({
            text: habit.name,
            type: 'habit',
            completed: habit.completed,
          }));
          setItems(prev => ({
            ...prev,
            [type]: convertedItems,
          }));
        }
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const saveItems = async (type: ItemType) => {
    if (!isAuthenticated || isLoading || loading[type]) return;

    try {
      const dateStr = formatDate(selectedDate);
      
      if (type === 'priority') {
        const prioritiesArray = items.priority.map(item => item.text);
        await fetch(`/api/${type}s`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priorities: prioritiesArray,
            date: dateStr,
          }),
        });
      } else if (type === 'habit') {
        const itemsToSave = items[type].map(item => ({
          name: item.text,
          completed: item.completed || false,
        }));

        if (items[type].length === 0) {
          await fetch(`/api/${type}s`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date: dateStr }),
          });
        } else {
          await fetch(`/api/${type}s`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              habits: itemsToSave,
              date: dateStr,
            }),
          });
        }
      }
    } catch (error) {
      console.error(`Error saving ${type}s:`, error);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchItems('habit');
    }
  }, [isAuthenticated, isLoading, selectedDate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      saveItems('habit');
    }
  }, [items.habit]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchItems('priority');
    }
  }, [isAuthenticated, isLoading, selectedDate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      saveItems('priority');
    }
  }, [items.priority]);

  const updateItem = async (type: ItemType, index: number, newValue: string) => {
    setItems(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, text: newValue } : item
      ),
    }));
  };

  const toggleItem = (type: ItemType, index: number) => {
    setItems(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const deleteItem = (type: ItemType, index: number) => {
    setItems(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addItem = (type: ItemType, text: string) => {
    setItems(prev => ({
      ...prev,
      [type]: [...prev[type], { text, type, completed: false }],
    }));
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      loading,
      updateItem,
      toggleItem,
      deleteItem,
      addItem,
    }}>
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