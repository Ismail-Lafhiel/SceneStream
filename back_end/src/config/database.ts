import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI as string;
  
  if (!mongoURI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  };

  const connectWithRetry = async (retryCount = 0, maxRetries = 5) => {
    try {
      console.log('Attempting MongoDB connection...');
      await mongoose.connect(mongoURI, options);
      console.log('MongoDB connected successfully');
      return true;
    } catch (error) {
      if (retryCount < maxRetries) {
        const retryDelay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
        console.log(`MongoDB connection attempt failed. Retrying in ${retryDelay/1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
        console.error('Connection error:', error);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        return connectWithRetry(retryCount + 1, maxRetries);
      } else {
        console.error('MongoDB connection failed after maximum retry attempts:', error);
        return false;
      }
    }
  };

  return connectWithRetry();
};

export { connectDB };