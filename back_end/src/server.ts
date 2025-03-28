import app from './app';
import mongoose from 'mongoose';
import config from './config/config';

const { port, mongoURI } = config;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });