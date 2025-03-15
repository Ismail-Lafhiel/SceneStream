import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema({
  cognitoId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  username: { type: String },
  status: { type: String },
  created: { type: Date },
});

export default mongoose.model<IUser>('User', UserSchema);