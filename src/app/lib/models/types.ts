// lib/models/types.ts

// Core type definitions
export const ITEM_TYPES = [
  'priority', 
  'task', 
  'habit', 
  'hour'
] as const;

export type ItemType = typeof ITEM_TYPES[number];

// UI Component definitions
export const COMPONENT_TYPES = [
  ...ITEM_TYPES,
  'month',
  'tags'
] as const;

export type ComponentType = typeof COMPONENT_TYPES[number];

// Layout sections
export const LAYOUT_TYPES = [
  'main',
  'aside',
  'headerToggles'
] as const;

export type LayoutType = typeof LAYOUT_TYPES[number];

// Generate toggle state type dynamically
export type TogglesState = {
  [K in ComponentType | LayoutType]: boolean;
};

// Default toggle states
export const DEFAULT_TOGGLE_STATE: TogglesState = {
  // Component toggles
  priority: true,
  task: true,
  habit: true,
  hour: false,
  month: true,
  tags: true,
  // Layout toggles
  main: true,
  aside: true,
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

// Initial states derived from config
export const ITEMS_INITIAL_STATE: Record<ItemType, Item[]> = Object.fromEntries(
  ITEM_TYPES.map(type => [type, [] as Item[]])
) as Record<ItemType, Item[]>;

export const ITEMS_LOADING_INITIAL_STATE = Object.fromEntries(
  ITEM_TYPES.map(type => [type, false])
) as Record<ItemType, boolean>;

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