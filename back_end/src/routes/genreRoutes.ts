import express from 'express';
import { getGenres, updateGenre, deleteGenre, addGenre } from '../controllers/genreController';

const router = express.Router();

router.get('/', getGenres);
router.post('/', addGenre);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

export default router;