import express from "express";
import {
  getTVShows,
  getTVShowById,
  updateTVShow,
  deleteTVShow,
  addTVShow,
} from "../controllers/tvShowController";
import { checkAdminGroup, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, checkAdminGroup, getTVShows);
// @ts-ignore
router.post("/", protect, checkAdminGroup, addTVShow);
router.get("/:id", protect, checkAdminGroup, getTVShowById);
// @ts-ignore
router.put("/:id", protect, checkAdminGroup, updateTVShow);
router.delete("/:id", protect, checkAdminGroup, deleteTVShow);

export default router;
