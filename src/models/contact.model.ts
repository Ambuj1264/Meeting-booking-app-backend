import mongoose from 'mongoose';

const ContactSchcema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ContactModel = mongoose.model('Contact', ContactSchcema);
