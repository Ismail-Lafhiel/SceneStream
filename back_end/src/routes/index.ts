import express from "express";
import movieRoutes from "./movieRoutes";
import tvShowRoutes from "./tvShowRoutes";
import genreRoutes from "./genreRoutes";
import userRoutes from "./userRoutes";
import bookmarkRoutes from "./bookmarkRoutes";

const router = express.Router();

router.use("/movies", movieRoutes);
router.use("/tvshows", tvShowRoutes);
router.use("/genres", genreRoutes);
router.use("/users", userRoutes);
router.use("/bookmarks", bookmarkRoutes);

export default router;
