const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");

exports.getCurrentUser = catchAsync(async (req, res) => {
  // Either use the token data directly or fetch from Cognito for full details
  const user = await userService.getUserById(req.user.id);
  res.json(user);
});

exports.createAdminUser = catchAsync(async (req, res) => {
  // Check if the requester is an admin
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  const userData = req.body;
  const newAdmin = await userService.createAdminUser(userData);
  res.status(201).json(newAdmin);
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

exports.updateUserRole = catchAsync(async (req, res) => {
  // Check if the requester is an admin
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  const { userId, role } = req.body;
  const updatedUser = await userService.updateUserRole(userId, role);
  res.json(updatedUser);
});
