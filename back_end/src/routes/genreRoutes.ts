import express from 'express';
import { getGenres, updateGenre, deleteGenre, addGenre, getGenre } from '../controllers/genreController';

const router = express.Router();

router.get('/', getGenres);
router.get('/:id', getGenre);
router.post('/', addGenre);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

export default router;