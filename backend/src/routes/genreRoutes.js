const express = require("express");
const genreController = require("../controllers/genreController");

const router = express.Router();

// Get all genres
router.get("/movies", genreController.getMovieGenres);
router.get("/tv", genreController.getTvGenres);

// Get specific genre
router.get("/:genreId", genreController.getGenreById);

// Get content by genre
router.get("/movies/discover", genreController.getMoviesByGenre);
router.get("/tv/discover", genreController.getTvShowsByGenre);

module.exports = router;
