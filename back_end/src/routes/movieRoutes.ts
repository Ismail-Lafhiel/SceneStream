import express from 'express';
import {
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  addMovie,
} from '../controllers/movieController';

const router = express.Router();

// Apply routes
router.get('/', getMovies);
router.post('/', addMovie);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;