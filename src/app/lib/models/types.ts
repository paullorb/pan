// lib/models/types.ts

// Core item types
export const ITEM_TYPES = [
  'priority', 
  'task', 
  'habit', 
  'hour'
] as const;

export type ItemType = typeof ITEM_TYPES[number];

// Toggle state interface - keeping original structure
export interface TogglesState {
  // Component toggles
  hours: boolean;      // matches with 'hour' ItemType
  priorities: boolean; // matches with 'priority' ItemType
  tasks: boolean;      // matches with 'task' ItemType
  month: boolean;
  habits: boolean;     // matches with 'habit' ItemType
  tags: boolean;
  // Layout toggles
  main: boolean;
  aside: boolean;
  // UI toggles
  headerToggles: boolean;
}

// Default toggle states - keeping original values
export const DEFAULT_TOGGLE_STATE: TogglesState = {
  // Component toggles
  hours: false,
  priorities: true,
  tasks: true,
  month: true,
  habits: true,
  tags: true,
  // Layout toggles
  main: true,
  aside: true,
  // UI toggles
  headerToggles: true,
};

// Item configuration
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

// Initial states
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

// Interface definitions
export interface Item {
  _id: string;
  text: string;
  type: ItemType;
  date: string;
  order?: number;
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
    order?: number;
  }) => Promise<void>;
  deleteItem: (type: ItemType, itemId: string) => Promise<void>;
  addItem: (type: ItemType, text: string, order?: number) => Promise<void>;
  toggleCompletion: (type: ItemType, id: string) => Promise<void>;
}