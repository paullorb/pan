// /models/Priority.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPriority extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  priorities: Array<{
    text: string;
    order: number;
  }>;
}

const PrioritySchema: Schema = new Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  priorities: [{
    text: { 
      type: String, 
      default: '' 
    },
    order: { 
      type: Number, 
      required: true,
      min: 0,
      max: 2
    }
  }]
});

// Initialize priorities array with three empty priorities when creating new document
PrioritySchema.pre('save', function(next) {
  if (this.isNew && (!this.priorities || (this.priorities as Array<{ text: string; order: number }>).length === 0)) {
    this.priorities = [
      { text: '', order: 0 },
      { text: '', order: 1 },
      { text: '', order: 2 }
    ];
  }
  next();
});

// Create a unique index to prevent duplicate entries for the same user and date
PrioritySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Priority || mongoose.model<IPriority>('Priority', PrioritySchema);