import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
await mongoose.connect(process.env.DATABASE_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
