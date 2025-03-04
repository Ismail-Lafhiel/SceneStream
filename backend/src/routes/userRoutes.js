const express = require("express");
const userController = require("../controllers/userController");
const cognitoAuth = require("../middlewares/cognitoAuth");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

// Protected routes
router.get("/me", cognitoAuth, userController.getCurrentUser);
router.get("/", cognitoAuth, userController.getAllUsers);

// Admin routes
router.post("/admin", cognitoAuth, adminAuth, userController.createAdminUser);
router.put("/role", cognitoAuth, adminAuth, userController.updateUserRole);

module.exports = router;
