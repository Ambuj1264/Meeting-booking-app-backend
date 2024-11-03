import { Schema, model } from 'mongoose';
import { ROLES } from '../utils/constant';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ROLES, default: ROLES.ADMIN },
    company: { type: String, required: true, unique: true },
    noOfMeetingRooms: { type: Number, default: 1, min: 1 },
    meetingRooms: {
      type: [
        {
          id: String,
          name: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = model('User', UserSchema);
