// lib/models/types.ts
export const ITEM_TYPES = ['priority', 'task', 'habit', 'hour'] as const;
export type ItemType = typeof ITEM_TYPES[number];

export const REGULARITY_TYPES = ['daily', 'weekly', 'monthly', 'yearly'] as const;
export type RegularityType = typeof REGULARITY_TYPES[number];

export interface ItemTypeConfig {
  maxOrder?: number;
  requiresRegularity?: boolean;
  allowsCompletion?: boolean;
}

export const ITEM_TYPE_CONFIG: Record<ItemType, ItemTypeConfig> = {
  priority: { maxOrder: 3 },
  task: { allowsCompletion: true },
  habit: { requiresRegularity: true, allowsCompletion: true },
  hour: {}
};