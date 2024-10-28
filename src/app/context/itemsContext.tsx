"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';
import { 
  ItemType, 
  Item, 
  ItemsContextType,
  ITEMS_INITIAL_STATE,
  ITEMS_LOADING_INITIAL_STATE,
  ITEM_CONFIG,
  RegularityType
} from '../lib/models/types';

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<ItemType, Item[]>>(ITEMS_INITIAL_STATE);
  const [loading, setLoading] = useState<Record<ItemType, boolean>>(ITEMS_LOADING_INITIAL_STATE);

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
        setItems(prev => ({
          ...prev,
          [type]: data.data.items
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
    id: string,
    text: string,
    options?: {
      completed?: boolean;
      regularity?: RegularityType;
      order?: number;
    }
  ) => {
    if (!isAuthenticated || !token) return;

    // If text is empty and it's a priority, delete the item instead
    if (type === 'priority' && text.trim() === '') {
      await deleteItem(type, id);
      return;
    }

    const config = ITEM_CONFIG[type];
    const finalOrder = options?.order ?? config.defaultOrder;

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
            order: finalOrder,
            completed: options?.completed,
            regularity: options?.regularity
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchItems(type);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const addItem = async (
    type: ItemType,
    text: string,
    order?: number,
    options?: { regularity?: RegularityType }
  ) => {
    if (!isAuthenticated || !token) return;

    const config = ITEM_CONFIG[type];
    const finalOrder = order ?? config.defaultOrder;

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
            order: finalOrder,
            regularity: options?.regularity
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchItems(type);
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
        await fetchItems(type);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      Object.keys(items).forEach(type => 
        fetchItems(type as ItemType)
      );
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