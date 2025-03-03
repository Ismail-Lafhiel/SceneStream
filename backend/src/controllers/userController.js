const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");

exports.getCurrentUser = catchAsync(async (req, res) => {
  // Either use the token data directly or fetch from Cognito for full details
  const user = await userService.getUserById(req.user.id);
  res.json(user);
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

// If you need to update user-specific data not in Cognito
exports.updateUserData = catchAsync(async (req, res) => {
  const extraData = req.body;
  const userData = await userService.updateUserExtraData(
    req.user.id,
    extraData
  );
  res.json(userData);
});
