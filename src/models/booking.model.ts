import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetingRoom: { type: String, required: true },
  meetingId: { type: String, required: true },
});
export const BookingModel = mongoose.model('Booking', BookingSchema);
