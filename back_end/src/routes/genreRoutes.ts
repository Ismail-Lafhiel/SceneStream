import express from "express";
import {
  getGenres,
  updateGenre,
  deleteGenre,
  addGenre,
  getGenre,
} from "../controllers/genreController";
import { checkAdminGroup, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, checkAdminGroup, getGenres);
router.get("/:id", protect, checkAdminGroup, getGenre);
router.post("/", protect, checkAdminGroup, addGenre);
router.put("/:id", protect, checkAdminGroup, updateGenre);
router.delete("/:id", protect, checkAdminGroup, deleteGenre);

export default router;
