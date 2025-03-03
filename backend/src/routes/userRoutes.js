const express = require("express");
const userController = require("../controllers/userController");
const cognitoAuth = require("../middlewares/cognitoAuth");

const router = express.Router();

// Protected routes
router.get("/me", cognitoAuth, userController.getCurrentUser);
router.get("/", cognitoAuth, userController.getAllUsers);

module.exports = router;