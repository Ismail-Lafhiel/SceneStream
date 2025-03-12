const express = require("express");
const genreController = require("../controllers/genreController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validation");

const router = express.Router();

// Get all genres
router.get("/movies", genreController.getMovieGenres);
router.get("/tv", genreController.getTvGenres);

// Get specific genre
router.get("/:genreId", genreController.getGenreById);

// Get content by genre
router.get("/movies/discover", genreController.getMoviesByGenre);
router.get("/tv/discover", genreController.getTvShowsByGenre);

// Protected admin routes
router.use(authMiddleware.protect, authMiddleware.checkAdminGroup);
router.get("/", genreController.getAllGenres);
router.post(
  "/",
  validationMiddleware.validateGenreData,
  genreController.createGenre
);
router.put(
  "/:genreId",
  validationMiddleware.validateGenreData,
  genreController.updateGenre
);
router.delete("/:genreId", genreController.deleteGenre);

module.exports = router;
