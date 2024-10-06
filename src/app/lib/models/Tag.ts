import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  userId: string;
  name: string;
  color?: string;
  count: number;
}

const TagSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  count: { type: Number, default: 0 },
});

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
