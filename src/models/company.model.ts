import mongoose from 'mongoose';

const mySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    meetingRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    noOfMeetingRooms: { type: Number, default: 1, min: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const CompanyModel = mongoose.model('Company', mySchema);
