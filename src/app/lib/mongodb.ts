import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async (dbName = 'test') => {

  const username = encodeURIComponent(process.env.MONGODB_USER || '');
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
  const cluster = process.env.MONGODB_CLUSTER || '';
  const db = process.env.MONGODB_DB || '';
  const dbURI = `mongodb+srv://${username}:${password}@${cluster}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(dbURI, { dbName });
    // console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    throw error;  // Rethrow to handle it outside
  }
};

export default connectDB;
