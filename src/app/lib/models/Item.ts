import mongoose, { Schema, Document } from 'mongoose';
import { ITEM_TYPES, REGULARITY_TYPES, ItemType, RegularityType } from './types';

export interface IItem extends Document {
  userId: mongoose.Types.ObjectId;
  type: ItemType;
  text: string;
  date: string;  
  order?: number;
  regularity?: RegularityType;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ITEM_TYPES,
    required: true
  },
  text: { 
    type: String, 
    default: '',
    trim: true  
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  order: {
    type: Number,
    default: 0,
    validate: {
      validator: function(this: IItem, v: number): boolean {
        return this.type !== 'priority' || (v >= 1 && v <= 3);
      },
      message: 'Priority order must be between 1 and 3'
    }
  },
  regularity: {
    type: String,
    default: 'daily',
    enum: {
      values: REGULARITY_TYPES,
      message: '{VALUE} is not a valid regularity'
    },
    required: function(this: IItem) {
      return this.type === 'habit';
    }
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.__v;  
      return ret;
    }
  }
});


ItemSchema.index({ 
  userId: 1, 
  date: 1, 
  type: 1, 
  order: 1 
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);