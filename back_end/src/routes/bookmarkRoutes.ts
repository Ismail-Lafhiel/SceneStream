import express from "express";
import { bookmarkController } from "../controllers/bookmarkController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all bookmark routes
router.use(protect);

// Create a bookmark
router.post("/", bookmarkController.createBookmark);

// Delete a bookmark
router.delete("/:type/:id", bookmarkController.deleteBookmark);

// Get all bookmarks for the authenticated user
router.get("/", bookmarkController.getUserBookmarks);

export default router;
