// app/models/Activity.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IActivity extends Document {
    hour: string;
    description: string;
}

const ActivitySchema: Schema = new Schema({
    hour: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
