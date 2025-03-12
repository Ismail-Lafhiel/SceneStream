const express = require("express");
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validation");
const {
  uploadMovieImages,
  processImageUploads,
} = require("../middlewares/uploadMiddleware");

const router = express.Router();

// public routes
router.get("/popular", movieController.getPopularMovies);
router.get("/trending", movieController.getTrendingMovies);
router.get("/new-releases", movieController.getNewReleases);
router.get("/:movieId", movieController.getMovieDetails);
router.get("/:movieId/similar", movieController.getSimilarMovies);
router.get("/top-rated", movieController.getTopRatedMovies);
router.get("/now-playing", movieController.getNowPlayingMovies);
router.get("/upcoming", movieController.getUpcomingMovies);
router.get("/:movieId/videos", movieController.getMovieVideos);
router.get("/discover", movieController.discoverMovies);

// Protected admin routes
router.use(authMiddleware.protect, authMiddleware.checkAdminGroup);
router.get("/", movieController.getAllMovies);
router.post(
  "/",
  validationMiddleware.validateMovieData,
  uploadMovieImages,
  processImageUploads,
  movieController.createMovie
);
router.patch(
  "/:movieId",
  validationMiddleware.validateMovieData,
  uploadMovieImages,
  processImageUploads,
  movieController.updateMovie
);
router.delete("/:movieId", movieController.deleteMovie);

module.exports = router;
