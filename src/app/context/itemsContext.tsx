"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

export type ItemType = 'priority' | 'task' | 'habit' | 'hour';

interface Item {
  _id?: string;
  text: string;
  type: ItemType;
  order?: number;
  regularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date?: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ItemsContextType {
  items: Record<ItemType, Item[]>;
  loading: Record<ItemType, boolean>;
  updateItem: (type: ItemType, index: number, text: string, options?: { 
    completed?: boolean; 
    regularity?: string;
    order?: number;
  }) => Promise<void>;
  deleteItem: (type: ItemType, itemId: string) => Promise<void>;
  addItem: (type: ItemType, text: string, order?: number, options?: { regularity?: string }) => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    priority: [],
    task: [],
    habit: [],
    hour: []
  });
  
  const [loading, setLoading] = useState<Record<ItemType, boolean>>({
    priority: false,
    task: false,
    habit: false,
    hour: false
  });

  const { isAuthenticated, token, logout } = useAuth();
  const { selectedDate } = useDate();

  const fetchItems = useCallback(async (type: ItemType) => {
    if (!isAuthenticated || !token) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const response = await fetch(
        `/api/items?date=${selectedDate.toISOString().split('T')[0]}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Sort items by order if they exist
        const sortedItems = data.data.items.sort((a: Item, b: Item) => 
          ((a.order ?? 0) - (b.order ?? 0))
        );

        setItems(prev => ({
          ...prev,
          [type]: sortedItems
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [isAuthenticated, token, selectedDate, logout]);

  const updateItem = async (
    type: ItemType, 
    index: number, 
    text: string, 
    options?: { 
      completed?: boolean; 
      regularity?: string;
      order?: number;
    }
  ) => {
    if (!isAuthenticated || !token) return;
    
    // Optimistically update the UI first
    setItems(prev => ({
      ...prev,
      [type]: prev[type].map((item, idx) => 
        idx === index ? { ...item, text } : item
      )
    }));
  
    try {
      const response = await fetch(
        `/api/items?date=${selectedDate.toISOString().split('T')[0]}&type=${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            text,
            order: options?.order,
            completed: options?.completed,
            regularity: options?.regularity
          })
        }
      );
  
      const data = await response.json();
      if (data.success) {
        // Update with server response
        setItems(prev => ({
          ...prev,
          [type]: prev[type].map((item, idx) => 
            idx === index ? { ...item, ...data.data.item } : item
          )
        }));
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      // Optionally revert the optimistic update on error
      await fetchItems(type);
    }
  };

  const addItem = async (type: ItemType, text: string, order?: number, options?: { regularity?: string }) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(
        `/api/items?date=${selectedDate.toISOString().split('T')[0]}&type=${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            text,
            order: type === 'priority' ? order : undefined,
            regularity: options?.regularity
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setItems(prev => ({
          ...prev,
          [type]: [...prev[type], data.data.item].sort((a, b) => 
            ((a.order ?? 0) - (b.order ?? 0))
          )
        }));
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
  };

  const deleteItem = async (type: ItemType, itemId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('/api/items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: itemId })
      });

      const data = await response.json();
      if (data.success) {
        setItems(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item._id !== itemId)
        }));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      (Object.keys(items) as ItemType[]).forEach(fetchItems);
    }
  }, [isAuthenticated, fetchItems]);

  return (
    <ItemsContext.Provider value={{ 
      items, 
      loading,
      updateItem,
      deleteItem,
      addItem
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