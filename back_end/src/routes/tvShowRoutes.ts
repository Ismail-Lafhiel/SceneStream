import express from "express";
import tvShowController from "../controllers/tvShowController";

const router = express.Router();

// TMDB API routes
router.get("/popular", tvShowController.getPopularTvShows);

// Database routes
router.post("/", tvShowController.addTVShow);
router.put("/:id", tvShowController.updateTVShow);
router.delete("/:id", tvShowController.deleteTVShow);
router.get("/", tvShowController.getAllTVShows);
router.get("/:id", tvShowController.getTVShowById);

export default router;
