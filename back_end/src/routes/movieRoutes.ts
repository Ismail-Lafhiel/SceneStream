import express from "express";
import {
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  addMovie,
} from "../controllers/movieController";
import { checkAdminGroup, protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Apply routes
router.get("/", getMovies);
// @ts-ignore
router.post("/", protect, checkAdminGroup, addMovie);
router.get("/:id", protect, checkAdminGroup, getMovieById);
// @ts-ignore
router.put("/:id", protect, checkAdminGroup, updateMovie);
router.delete("/:id", protect, checkAdminGroup, deleteMovie);

export default router;
