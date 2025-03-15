import express from 'express';
import {
  getTVShows,
  getTVShowById,
  updateTVShow,
  deleteTVShow,
  addTVShow,
} from '../controllers/tvShowController';

const router = express.Router();

router.get('/', getTVShows);
router.post('/', addTVShow);
router.get('/:id', getTVShowById);
router.put('/:id', updateTVShow);
router.delete('/:id', deleteTVShow);

export default router;