import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    // capacity: { type: Number, required: true },
    // isAvailable: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const RoomModel = mongoose.model('Room', roomSchema);
