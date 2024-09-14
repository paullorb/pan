import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  priorities: string[];
  // ...other fields
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  priorities: { type: [String], default: ['', '', ''] },
  // ...other fields
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
