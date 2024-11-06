// lib/models/types.ts
export const ITEM_TYPES = [
  'priority', 
  'task', 
  'habit', 
  'hour'] as const;
export type ItemType = typeof ITEM_TYPES[number];

export const REGULARITY_TYPES = [
  'daily', 
  'weekly', 
  'monthly', 
  'yearly'] as const;
export type RegularityType = typeof REGULARITY_TYPES[number];

// Single unified configuration object
export const ITEM_CONFIG = {
  priority: {
    maxOrder: 3,
    allowsCompletion: false,
    requiresRegularity: false,
    label: 'Priorities',
    defaultOrder: 1,
    maxItems: 3,
    initialState: [] as Item[]
  },
  task: {
    maxOrder: undefined,
    allowsCompletion: true,
    requiresRegularity: false,
    label: 'Tasks',
    defaultOrder: 0,
    initialState: [] as Item[]
  },
  habit: {
    maxOrder: undefined,
    allowsCompletion: true,
    requiresRegularity: true,
    label: 'Habits',
    defaultOrder: 0,
    initialState: [] as Item[]
  },
  hour: {
    maxOrder: undefined,
    allowsCompletion: false,
    requiresRegularity: false,
    label: 'Hours',
    defaultOrder: 0,
    initialState: [] as Item[]
  }
} as const;

export const ITEMS_INITIAL_STATE: Record<ItemType, Item[]> = {
  priority: [],
  task: [],
  habit: [],
  hour: []
} as const;

export const ITEMS_LOADING_INITIAL_STATE = {
  priority: false,
  task: false,
  habit: false,
  hour: false
} as const;

// Frontend interfaces
export interface Item {
  _id: string;
  text: string;
  type: ItemType;
  date: string;
  order?: number;
  regularity?: RegularityType;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsContextType {
  items: Record<ItemType, Item[]>;
  loading: Record<ItemType, boolean>;
  itemsByDate: Record<string, Item[]>;
  updateItem: (type: ItemType, id: string, text: string, options?: { 
    completed?: boolean; 
    regularity?: RegularityType;
    order?: number;
  }) => Promise<void>;
  deleteItem: (type: ItemType, itemId: string) => Promise<void>;
  addItem: (type: ItemType, text: string, order?: number, options?: { 
    regularity?: RegularityType 
  }) => Promise<void>;
  toggleCompletion: (type: ItemType, id: string) => Promise<void>;
}