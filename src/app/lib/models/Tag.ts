import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  userId: string;
  name: string;
}

const TagSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }
});

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);