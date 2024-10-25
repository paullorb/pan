// lib/utils/itemsUtils.ts
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

// Types
export interface ItemDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  text: string;
  order: number;
  regularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date?: string;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostRequestBody {
  text: string;
  order?: number;
  regularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed?: boolean;
}

export type ItemType = 'priority' | 'task' | 'habit' | 'hour';

// Auth utility
export const verifyAuth = async (request: Request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
  return new Types.ObjectId(decoded.userId);
};

// Date utilities
export const getDateRange = (date: string) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const formatDateForApi = (date: Date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  return d.toISOString().split('T')[0];
};