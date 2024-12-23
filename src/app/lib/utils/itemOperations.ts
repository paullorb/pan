// lib/utils/itemOperations.ts

import { ItemType, Item } from '../models/types';
import { ItemsContextType } from '../models/types';

export const handleItemAdd = async (
  itemsContext: ItemsContextType,
  type: ItemType,
  text: string,
  order?: number
) => {
  if (!text.trim()) return;
  await itemsContext.addItem(type, text, order);
};

export const handleItemDelete = async (
  itemsContext: ItemsContextType,
  type: ItemType,
  itemId: string
) => {
  if (!itemId) return;
  await itemsContext.deleteItem(type, itemId);
};

export const createOrderedSlots = (
  items: Item[],
  maxSlots: number,
  type: ItemType
) => {
  return Array(maxSlots).fill(null).map((_, index) => {
    const order = index + 1;
    const existingItem = items.find(item => item.order === order);
    
    return {
      text: existingItem?.text || '',
      _id: existingItem?._id,
      completed: existingItem?.completed || false,
      type: type,
      order: order,
      id: `${type}-${order}`
    };
  });
};