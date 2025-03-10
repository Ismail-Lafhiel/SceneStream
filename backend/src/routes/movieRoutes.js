const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

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

module.exports = router;