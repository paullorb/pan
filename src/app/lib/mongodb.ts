import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const dbConnect = async () => {
    if (mongoose.connection.readyState === 0) { // Only connect if no connection already exists
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }
    return mongoose.connection;
}

export default dbConnect;
