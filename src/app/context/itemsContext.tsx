"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';

export type ItemType = 'priority' | 'task' | 'habit' | 'hour';

interface Item {
  _id?: string;
  text: string;
  type: ItemType;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ItemsContextType {
  items: Record<ItemType, Item[]>;
  loading: Record<ItemType, boolean>;
  updateItem: (type: ItemType, index: number, text: string) => Promise<void>;
  deleteItem: (type: ItemType, itemId: string) => Promise<void>;
  addItem: (type: ItemType, text: string, order?: number) => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  // Helper to format date for API requests
  const formatDateForApi = (date: Date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    return d.toISOString().split('T')[0];
  };

  const fetchItems = async (type: ItemType) => {
    if (!isAuthenticated || !token) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const response = await fetch(
        `/api/items?date=${formatDateForApi(selectedDate)}&type=${type}`,
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
        const sortedItems = (data.data.items || []).sort((a: Item, b: Item) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });

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
  };

  const addItem = async (type: ItemType, text: string, order?: number) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(`/api/items?date=${formatDateForApi(selectedDate)}&type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text,
          ...(order !== undefined && { order })  // Only include order if provided
        })
      });

      const data = await response.json();
      if (data.success) {
        setItems(prev => ({
          ...prev,
          [type]: [...prev[type], data.data.item]
        }));
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
  };

  const updateItem = async (type: ItemType, index: number, text: string) => {
    if (!isAuthenticated || !token) return;
    
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      const item = items[type][index];
      const order = type === 'priority' ? index : undefined;

      const response = await fetch(`/api/items?date=${formatDateForApi(selectedDate)}&type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text,
          ...(order !== undefined && { order })
        })
      });

      const data = await response.json();
      if (data.success) {
        setItems(prev => ({
          ...prev,
          [type]: prev[type].map((item, idx) => {
            if (idx === index) {
              // Preserve existing item properties and update with new data
              return {
                ...item,
                ...data.data.item,
                text
              };
            }
            return item;
          })
        }));
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
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

  // Fetch items when date changes or on mount
  useEffect(() => {
    if (isAuthenticated) {
      Object.keys(items).forEach((type) => {
        fetchItems(type as ItemType);
      });
    }
  }, [isAuthenticated, selectedDate]);

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