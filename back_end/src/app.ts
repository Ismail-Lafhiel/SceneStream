import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';
import routes from './routes';
import { errorHandler } from './utils/errors';
import * as userService from './services/userService';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sync users from Cognito to MongoDB
userService
  .syncUsersFromCognito()
  .then(() => {
    console.log("Users synced from Cognito to MongoDB.");
  })
  .catch((error) => {
    console.error("Failed to sync users from Cognito:", error);
  });

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;