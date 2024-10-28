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
import { apiRequest, formatDate, handleError } from '../lib/utils/apiUtils';

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
      const data = await apiRequest<{ items: Item[] }>(
        `/api/items?date=${formatDate(selectedDate)}&type=${type}`,
        token
      );
      setItems(prev => ({
        ...prev,
        [type]: data.items
      }));
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        logout();
      }
      handleError(error, `fetching ${type}`);
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

    if (type === 'priority' && text.trim() === '') {
      await deleteItem(type, id);
      return;
    }

    const config = ITEM_CONFIG[type];
    const finalOrder = options?.order ?? config.defaultOrder;

    try {
      await apiRequest(
        `/api/items?date=${formatDate(selectedDate)}&type=${type}`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({
            text,
            order: finalOrder,
            completed: options?.completed,
            regularity: options?.regularity
          })
        }
      );
      await fetchItems(type);
    } catch (error) {
      handleError(error, `updating ${type}`);
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
      await apiRequest(
        `/api/items?date=${formatDate(selectedDate)}&type=${type}`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({
            text,
            order: finalOrder,
            regularity: options?.regularity
          })
        }
      );
      await fetchItems(type);
    } catch (error) {
      handleError(error, `adding ${type}`);
    }
  };

  const deleteItem = async (type: ItemType, itemId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      await apiRequest(
        '/api/items',
        token,
        {
          method: 'DELETE',
          body: JSON.stringify({ id: itemId })
        }
      );
      await fetchItems(type);
    } catch (error) {
      handleError(error, `deleting ${type}`);
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