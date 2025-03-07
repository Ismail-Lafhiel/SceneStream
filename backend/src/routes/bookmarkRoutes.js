const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// All bookmark routes require authentication
router.use(authMiddleware.protect);

// Create a bookmark (movie or TV show)
router.post("/", bookmarkController.createBookmark);

// Delete a bookmark (movie or TV show)
router.delete("/:type/:id", bookmarkController.deleteBookmark);

// Get all bookmarks (movies and TV shows) for the authenticated user
router.get("/", bookmarkController.getUserBookmarks);

module.exports = router;