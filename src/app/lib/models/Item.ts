import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  text: string;
  order: number;
  regularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date?: string; 
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  text: { type: String, default: '' },
  order: { type: Number, default: 0 },
  regularity: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function(this: IItem) {
      return this.type === 'habit';
    }
  },
  date: { 
    type: String,  // Store as YYYY-MM-DD string for easier querying
    required: function(this: IItem) {
      return this.type === 'habit' && this.completed;
    }
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Compound index for efficient queries
ItemSchema.index({ userId: 1, type: 1, order: 1, createdAt: -1 });
ItemSchema.index({ userId: 1, type: 1, regularity: 1 });
ItemSchema.index({ userId: 1, type: 1, date: 1 }); // New index for date-based queries

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);