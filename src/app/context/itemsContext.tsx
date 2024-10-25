// context/itemsContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './authContext';
import { useDate } from './dateContext';
import { itemsService, Item, ItemType } from '../lib/services/itemsService';

interface ItemsContextType {
  items: Record<ItemType, Item[]>;
  loading: Record<ItemType, boolean>;
  updateItem: (type: ItemType, index: number, text: string, options?: { completed?: boolean; regularity?: string }) => Promise<void>;
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
      const fetchedItems = await itemsService.fetchItems({
        token,
        date: selectedDate,
        type
      });
      
      setItems(prev => ({
        ...prev,
        [type]: fetchedItems
      }));
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        logout();
      }
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [isAuthenticated, token, selectedDate, logout]);

  const addItem = async (type: ItemType, text: string, order?: number, options?: { regularity?: string }) => {
    if (!isAuthenticated || !token) return;

    try {
      const newItem = await itemsService.addItem({
        token,
        date: selectedDate,
        type,
        text,
        order,
        regularity: options?.regularity
      });

      setItems(prev => ({
        ...prev,
        [type]: [...prev[type], newItem]
      }));
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
  };

  const deleteItem = async (type: ItemType, itemId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      await itemsService.deleteItem(token, itemId);
      setItems(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item._id !== itemId)
      }));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const updateItem = async (
    type: ItemType, 
    index: number, 
    text: string, 
    options?: { completed?: boolean; regularity?: string }
  ) => {
    if (!isAuthenticated || !token) return;
    
    try {
      const updatedItem = await itemsService.updateItem({
        token,
        date: selectedDate,
        type,
        text,
        index,
        completed: options?.completed,
        regularity: options?.regularity
      });
  
      setItems(prev => ({
        ...prev,
        [type]: prev[type].map((i, idx) => 
          idx === index ? { ...i, ...updatedItem } : i
        )
      }));
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
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