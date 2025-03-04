const { ApiError } = require("../utils/errors");

const adminAuth = async (req, res, next) => {
  try {
    // Ensure the user exists and has admin role
    if (!req.user || req.user.role !== "ADMIN") {
      throw new ApiError(403, "Admin access required");
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = adminAuth;