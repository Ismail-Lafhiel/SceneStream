const express = require("express");
const tvShowController = require("../controllers/tvShowController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validation");
const {
  uploadMovieImages,
  processImageUploads,
} = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/popular", tvShowController.getPopularTvShows);
router.get("/top-rated", tvShowController.getTopRatedTvShows);
router.get("/on-air", tvShowController.getOnAirTvShows);
router.get("/upcoming", tvShowController.getUpcomingTvShows);
router.get("/:tvId/videos", tvShowController.getTvShowVideos);
router.get("/:tvId", tvShowController.getTvShowDetails);
router.get("/:tvId/similar", tvShowController.getSimilarTvShows);
router.get("/discover", tvShowController.discoverTvShows);

// Protected admin routes
router.use(authMiddleware.protect, authMiddleware.checkAdminGroup);
router.get("/", tvShowController.getAllTvShows);
router.post(
  "/",
  validationMiddleware.validateTvShowData,
  uploadMovieImages,
  processImageUploads,
  tvShowController.createTvShow
);
router.patch(
  "/:tvId",
  validationMiddleware.validateTvShowData,
  uploadMovieImages,
  processImageUploads,
  tvShowController.updateTvShow
);
router.delete("/:tvId", tvShowController.deleteTvShow);

module.exports = router;
