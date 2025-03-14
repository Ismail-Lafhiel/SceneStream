import express from "express";
import movieRoutes from "./movieRoutes";
import tvShowRoutes from "./tvShowRoutes";
import genreRoutes from "./genreRoutes";

const router = express.Router();

router.use("/movies", movieRoutes);
router.use("/tvshows", tvShowRoutes);
router.use("/genres", genreRoutes);

export default router;
