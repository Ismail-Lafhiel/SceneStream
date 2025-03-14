import express from "express";
import movieController from "../controllers/movieController";

const router = express.Router();

// TMDB API routes
router.get("/popular", movieController.getPopularMovies);

// Database routes
router.post("/", movieController.addMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);
router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);

export default router;
