const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// All bookmark routes require authentication
router.use(authMiddleware.protect);

router.post("/", bookmarkController.createBookmark);
router.delete("/:movieId", bookmarkController.deleteBookmark);
router.get("/", bookmarkController.getUserBookmarks);

module.exports = router;
