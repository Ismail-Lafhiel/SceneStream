const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

/**
 * Fetch users from MongoDB (only accessible by ADMIN group).
 */
exports.getUsersData = catchAsync(async (req, res) => {
  // Fetch users from MongoDB
  const users = await User.find({}); // Fetch all users from MongoDB

  res.json(users);
});
