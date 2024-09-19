// app/lib/models/Activity.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  date: string;
  activities: { [key: string]: string };
}

const ActivitySchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  activities: { type: Object, required: true },
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
