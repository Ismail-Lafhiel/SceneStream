import app from './app';
import mongoose from 'mongoose';
import config from './config/config';
import { syncMovies, syncTVShows, syncGenres } from './sync';

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

    // Run the sync process when the app starts
    console.log('Starting sync process...');
    await syncMovies();
    await syncTVShows();
    await syncGenres();
    console.log('Sync process completed.');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });