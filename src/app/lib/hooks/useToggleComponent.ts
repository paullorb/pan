// lib/hooks/useToggleComponent.ts

import { useItems } from '../../context/itemsContext';
import { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import { ItemType } from '../models/types';

export const useToggleComponent = (componentType: ItemType) => {
  const itemsContext = useItems();
  const { items, loading, toggleCompletion } = itemsContext;
  const componentItems = items[componentType];

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error(`${componentType} must be used within a TogglesProvider`);
  }

  const { togglesState } = togglesContext;
  // Access the specific toggle state using bracket notation
  const isEnabled = togglesState[componentType as keyof typeof togglesState] ?? true;

  return {
    items: componentItems,
    loading: loading[componentType],
    toggleCompletion,
    isEnabled,
    itemsContext
  };
};