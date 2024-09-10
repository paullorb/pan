// lib/dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async (dbName = 'test') => {
  const dbURI = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(dbURI, { dbName });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    throw error;  // Rethrow to handle it outside
  }
};

export default connectDB;
