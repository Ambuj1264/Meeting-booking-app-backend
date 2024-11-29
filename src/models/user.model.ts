import { Schema, model } from 'mongoose';
import { ROLES } from '../utils/constant';
import mongoose from 'mongoose';
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ROLES, default: ROLES.ADMIN },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Company',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = model('User', UserSchema);
