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
} from '../lib/models/types';
import { apiRequest, formatDate, handleError } from '../lib/utils/apiUtils';

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<ItemType, Item[]>>(ITEMS_INITIAL_STATE);
  const [itemsByDate, setItemsByDate] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState<Record<ItemType, boolean>>(ITEMS_LOADING_INITIAL_STATE);

  const { isAuthenticated, token, logout } = useAuth();
  const { selectedDate } = useDate();

  const fetchItems = useCallback(async (type: ItemType) => {
    if (!isAuthenticated || !token) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const data = await apiRequest<{ items: Item[] }>(
        `/api/items?startDate=${formatDate(firstDay)}&endDate=${formatDate(lastDay)}&type=${type}`,
        token
      );

      // Group items by date
      const byDate = data.items.reduce((acc: Record<string, Item[]>, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      }, {});

      setItemsByDate(prev => ({
        ...prev,
        ...byDate
      }));
      
      // Set current day's items
      const currentDateString = formatDate(selectedDate);
      setItems(prev => ({
        ...prev,
        [type]: data.items.filter(item => item.date === currentDateString)
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

  useEffect(() => {
    if (isAuthenticated) {
      Object.keys(items).forEach(type => 
        fetchItems(type as ItemType)
      );
    }
  }, [isAuthenticated, fetchItems]);

  const toggleCompletion = async (type: ItemType, id: string) => {
    if (!isAuthenticated || !token) return;
  
    const item = items[type].find(i => i._id === id);
    if (!item) return;
  
    // Optimistically update both items and itemsByDate
    setItems(prev => ({
      ...prev,
      [type]: prev[type].map(i => 
        i._id === id ? { ...i, completed: !i.completed } : i
      )
    }));
  
    // Update itemsByDate as well
    setItemsByDate(prev => {
      const newItemsByDate = { ...prev };
      Object.keys(newItemsByDate).forEach(date => {
        newItemsByDate[date] = newItemsByDate[date].map(i => 
          i._id === id ? { ...i, completed: !i.completed } : i
        );
      });
      return newItemsByDate;
    });
  
    try {
      await apiRequest(
        `/api/items?date=${formatDate(selectedDate)}&type=${type}`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({
            text: item.text,
            completed: !item.completed,
            order: item.order
          })
        }
      );
    } catch (error) {
      // Revert both updates on error
      setItems(prev => ({
        ...prev,
        [type]: items[type]
      }));
      setItemsByDate(prev => ({
        ...prev,
        [formatDate(selectedDate)]: prev[formatDate(selectedDate)].map(i => 
          i._id === id ? { ...i, completed: item.completed } : i
        )
      }));
      handleError(error, `toggling ${type}`);
    }
  };

  const updateItem = async (
    type: ItemType,
    id: string,
    text: string,
    options?: {
      completed?: boolean;
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
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (data.success) {
        setItems(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item._id !== itemId)
        }));
      } else {
        console.error('Failed to delete item:', data.error);
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
      itemsByDate,
      deleteItem,
      addItem,
      toggleCompletion
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