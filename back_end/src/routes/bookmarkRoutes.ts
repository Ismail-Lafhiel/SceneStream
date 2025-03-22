import express from "express";
import { bookmarkController } from "../controllers/bookmarkController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

// Create a bookmark
router.post("/", bookmarkController.createBookmark);

// Delete a bookmark
router.delete("/:type/:id", bookmarkController.deleteBookmark);

// Get all bookmarks
router.get("/", bookmarkController.getUserBookmarks);

export default router;
