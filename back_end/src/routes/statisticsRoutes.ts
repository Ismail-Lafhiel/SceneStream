import express from "express";
import {
  getMovieStatistics,
  getTVShowStatistics,
  getGenreStatistics,
  getUserStatistics,
  getAllStatistics,
} from "../controllers/statisticsController";

const router = express.Router();

// Apply routes
router.get("/movies", getMovieStatistics);
router.get("/tvshows", getTVShowStatistics);
router.get("/genres", getGenreStatistics);
router.get("/users", getUserStatistics);
router.get("/", getAllStatistics);

export default router;