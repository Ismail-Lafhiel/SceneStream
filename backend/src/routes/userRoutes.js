// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware.protect);

// Fetch users data (only accessible by users in the ADMIN group)
router.get(
  "/admin/users",
  authMiddleware.checkAdminGroup, // Check if the user is in the ADMIN group
  userController.getUsersData
);

module.exports = router;