import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import Item, { IItem } from '../models/Item';
import { ItemType, RegularityType } from '../models/types';
import { formatDate } from './apiUtils';

export interface ItemDocument extends IItem {
  _id: Types.ObjectId;
}

export interface PostRequestBody {
  text: string;
  order?: number;
  regularity?: RegularityType;
  completed?: boolean;
}

export const verifyAuth = async (request: Request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
  return new Types.ObjectId(decoded.userId);
};

export const queryItems = async (
  userId: Types.ObjectId,
  type: ItemType,
  date: string
) => {
  const dateString = formatDate(new Date(date));
  const currentDate = new Date(date);
  
  const baseQuery = {
    userId,
    type,
    date: dateString
  };

  if (type === 'habit') {
    const habits = await Item.find({
      userId,
      type: 'habit',
      createdAt: { $lte: currentDate }
    }).lean().exec() as unknown as ItemDocument[];

    const completions = await Item.find({
      ...baseQuery,
      completed: true
    }).lean().exec() as unknown as ItemDocument[];

    return habits.map(habit => ({
      ...habit,
      completed: completions.some(completion => 
        completion._id.toString() === habit._id.toString()
      ),
      date: dateString
    }));
  }

  return await Item.find(baseQuery)
    .sort({ order: 1, createdAt: 1 })
    .lean()
    .exec() as unknown as ItemDocument[];
};

export const saveItem = async (
  userId: Types.ObjectId,
  type: ItemType,
  date: string,
  data: PostRequestBody
) => {
  const dateString = formatDate(new Date(date));
  
  const baseItem = {
    userId,
    type,
    date: dateString,
    text: data.text,
    order: data.order || 0
  };

  if (type === 'habit') {
    const existingHabit = await Item.findOne({
      userId,
      type: 'habit',
      text: data.text,
      regularity: data.regularity
    }).lean().exec() as unknown as ItemDocument | null;

    if (data.completed !== undefined && existingHabit) {
      if (data.completed) {
        return await Item.findOneAndUpdate(
          { _id: existingHabit._id },
          { $set: { ...baseItem, completed: true } },
          { upsert: true, new: true }
        ).lean().exec() as unknown as ItemDocument;
      }
      await Item.deleteOne({
        _id: existingHabit._id,
        date: dateString
      });
      return existingHabit;
    }

    if (existingHabit) {
      return await Item.findByIdAndUpdate(
        existingHabit._id,
        { ...baseItem, regularity: data.regularity },
        { new: true }
      ).lean().exec() as unknown as ItemDocument;
    }
  }

  if (type === 'priority' && data.order) {
    const existing = await Item.findOne({
      userId,
      type: 'priority',
      date: dateString,
      order: data.order
    }).lean().exec() as unknown as ItemDocument | null;

    if (existing) {
      return await Item.findByIdAndUpdate(
        existing._id,
        baseItem,
        { new: true }
      ).lean().exec() as unknown as ItemDocument;
    }
  }

  return await Item.create(baseItem) as unknown as ItemDocument;
};