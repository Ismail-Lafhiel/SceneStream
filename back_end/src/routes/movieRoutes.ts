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
// @ts-ignore
router.post('/', addMovie);
router.get('/:id', getMovieById);
// @ts-ignore
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;