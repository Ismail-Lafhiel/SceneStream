import express from "express";
import genreController from "../controllers/genreController";

const router = express.Router();

// TMDB API routes
router.get("/movie", genreController.getMovieGenres);
router.get("/tv", genreController.getTvGenres);

// Database routes
router.post("/", genreController.addGenre);
router.get("/", genreController.getAllGenres);

export default router;
