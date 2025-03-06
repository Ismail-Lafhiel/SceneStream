// middlewares/authMiddleware.js
const catchAsync = require("../utils/catchAsync");
const { ApiError } = require("../utils/errors");
const verifyCognitoToken = require("../utils/verifyCognitoToken");

/**
 * Middleware to check if the user is authenticated.
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new ApiError(401, "You are not logged in. Please log in to get access.")
    );
  }

  // 2) Verify Cognito token
  const decoded = await verifyCognitoToken(token);

  // 3) Attach user to request object
  req.user = {
    id: decoded.sub, // Cognito user ID (sub)
    email: decoded.email,
    groups: decoded["cognito:groups"] || [],
  };

  next();
});

/**
 * Middleware to check if the user is in the ADMIN group in Cognito.
 */
exports.checkAdminGroup = catchAsync(async (req, res, next) => {
  // Check if the user is in the ADMIN group
  const isAdmin = req.user.groups && req.user.groups.includes("ADMIN");

  if (!isAdmin) {
    return next(
      new ApiError(
        403,
        "Forbidden: You must be in the ADMIN group to access this resource."
      )
    );
  }

  next();
});
