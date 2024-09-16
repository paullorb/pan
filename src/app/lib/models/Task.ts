// Task.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // Store dates as strings in 'YYYY-MM-DD' format
  text: string;
  completed: boolean;
}

const TaskSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create an index to improve query performance
TaskSchema.index({ userId: 1, date: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
