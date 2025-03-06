// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware.protect);

// Fetch users data (only accessible by users in the ADMIN group)
router.get(
  "/users",
  authMiddleware.checkAdminGroup,
  userController.getUsersData
);

module.exports = router;