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
// @ts-ignore
router.post('/', addTVShow);
router.get('/:id', getTVShowById);
// @ts-ignore
router.put('/:id', updateTVShow);
router.delete('/:id', deleteTVShow);

export default router;