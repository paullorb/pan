import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  filterPreference?: string | null;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  filterPreference: { type: String, default: null }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
