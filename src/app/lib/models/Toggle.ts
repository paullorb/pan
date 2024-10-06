// /lib/models/Toggle.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IToggle extends Document {
  userId: mongoose.Types.ObjectId;
  togglesState: {
    hours: boolean;
    priorities: boolean;
    tasks: boolean;
    month: boolean;
    habits: boolean;
    tags: boolean;
  };
}

const ToggleSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
  togglesState: {
    hours: { type: Boolean, default: false },
    priorities: { type: Boolean, default: false },
    tasks: { type: Boolean, default: false },
    month: { type: Boolean, default: false },
    habits: { type: Boolean, default: false },
    tags: { type: Boolean, default: false },
  },
});

// Ensure there's only one toggles document per user
ToggleSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.Toggle || mongoose.model<IToggle>('Toggle', ToggleSchema);
