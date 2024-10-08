// /models/habit.ts
// DO NOT RENAME FOR NOW

import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string
  date: string; 
  habits: {
    name: string;
    completed: boolean;
  }[];
}

const HabitSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  habits: [
    {
      name: { type: String, required: true },
      completed: { type: Boolean, required: true },
    },
  ],
});

// Create a unique index to prevent duplicate entries for the same user and date
HabitSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema);
