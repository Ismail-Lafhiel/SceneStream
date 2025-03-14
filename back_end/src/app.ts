import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';
import routes from './routes';
import { errorHandler } from './utils/errors';

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Log requests
app.use(morgan('dev')); // HTTP request logger

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;