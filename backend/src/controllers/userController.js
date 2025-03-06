// controllers/userController.js
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/userService");

/**
 * Fetch users from MongoDB (only accessible by ADMIN group).
 */
exports.getUsersData = catchAsync(async (req, res) => {
  // Fetch users from MongoDB
  const users = await userService.getUsersData();

  res.json(users);
});