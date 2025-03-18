import express from "express";
import movieRoutes from "./movieRoutes";
import tvShowRoutes from "./tvShowRoutes";
import genreRoutes from "./genreRoutes";
import userRoutes from "./userRoutes";
import bookmarkRoutes from "./bookmarkRoutes";
import statisticsRoutes from "./statisticsRoutes";

const router = express.Router();

router.use("/statistics", statisticsRoutes);
router.use("/movies", movieRoutes);
router.use("/tvshows", tvShowRoutes);
router.use("/genres", genreRoutes);
router.use("/users", userRoutes);
router.use("/bookmarks", bookmarkRoutes);

export default router;
