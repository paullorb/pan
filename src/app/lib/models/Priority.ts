import mongoose, { Schema, Document } from 'mongoose';

export interface IPriority extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // We'll store dates as strings in 'YYYY-MM-DD' format
  priorities: string[];
}

const PrioritySchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  priorities: { type: [String], default: ['', '', ''] },
});

// Create a unique index to prevent duplicate entries for the same user and date
PrioritySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Priority || mongoose.model<IPriority>('Priority', PrioritySchema);
