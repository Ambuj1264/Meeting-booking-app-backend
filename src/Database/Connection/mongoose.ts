import mongoose from 'mongoose';

export const connectDB = async () => {
  console.log(
    process.env.DATABASE_URI,
    '===========proccess env uri==============='
  );
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
