// lib/services/itemsService.ts
import { formatDateForApi } from '../utils/itemsUtils';

export type ItemType = 'priority' | 'task' | 'habit' | 'hour';

export interface Item {
  _id?: string;
  text: string;
  type: ItemType;
  order?: number;
  regularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FetchOptions {
  token: string;
  date: Date;
  type: ItemType;
}

interface UpdateOptions extends FetchOptions {
  text: string;
  index: number;
  completed?: boolean;
  regularity?: string;
}

interface AddOptions extends FetchOptions {
  text: string;
  order?: number;
  regularity?: string;
}

export const itemsService = {
  async fetchItems({ token, date, type }: FetchOptions) {
    const response = await fetch(
      `/api/items?date=${formatDateForApi(date)}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    if (data.success) {
      return (data.data.items || []).sort((a: Item, b: Item) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });
    }
    throw new Error('Failed to fetch items');
  },

  async updateItem({ token, date, type, text, index, completed, regularity }: UpdateOptions) {
    const response = await fetch(
      `/api/items?date=${formatDateForApi(date)}&type=${type}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text,
          ...(type === 'priority' && { order: index }),
          ...(completed !== undefined && { completed }),
          ...(regularity && { regularity })
        })
      }
    )

    const data = await response.json();
    if (data.success) {
      return data.data.item;
    }
    throw new Error('Failed to update item');
  },

  async addItem({ token, date, type, text, order, regularity }: AddOptions) {
    const response = await fetch(
      `/api/items?date=${formatDateForApi(date)}&type=${type}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text,
          ...(order !== undefined && { order }),
          ...(regularity && { regularity })
        })
      }
    );

    const data = await response.json();
    if (data.success) {
      return data.data.item;
    }
    throw new Error('Failed to add item');
  },

  async deleteItem(token: string, itemId: string) {
    const response = await fetch('/api/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id: itemId })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to delete item');
    }
  }
};