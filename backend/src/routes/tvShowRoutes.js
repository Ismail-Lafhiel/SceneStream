const express = require("express");
const tvShowController = require("../controllers/tvShowController");

const router = express.Router();

router.get("/popular", tvShowController.getPopularTvShows);
router.get("/top-rated", tvShowController.getTopRatedTvShows);
router.get("/on-air", tvShowController.getOnAirTvShows);
router.get("/upcoming", tvShowController.getUpcomingTvShows);
router.get("/:tvId/videos", tvShowController.getTvShowVideos);
router.get("/:tvId", tvShowController.getTvShowDetails);
router.get("/:tvId/similar", tvShowController.getSimilarTvShows);
router.get("/discover", tvShowController.discoverTvShows);

module.exports = router;