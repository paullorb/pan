// Item.ts (Schema)
import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  text: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  text: { type: String, default: '' },
  order: { type: Number, required: true }  // 0, 1, 2 for priorities
}, { 
  timestamps: true
});

// Compound index to ensure uniqueness of priority slots per user per day
ItemSchema.index({ 
  userId: 1, 
  type: 1, 
  order: 1,
  createdAt: 1
}, { 
  unique: true,
  partialFilterExpression: { type: 'priority' }  // Only apply to priority items
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);