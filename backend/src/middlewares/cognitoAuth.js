const { CognitoJwtVerifier } = require("aws-jwt-verify");
const config = require("../config/config");
const { ApiError } = require("../utils/errors");
const User = require("../models/user");

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.aws.userPoolId,
  clientId: config.aws.clientId,
  tokenUse: "access",
});

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Authentication token is required");
    }

    // Verify the JWT token
    const payload = await verifier.verify(token);

    // Add user info to request object
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload["cognito:username"],
    };

    // Ensure user exists in our database
    try {
      let user = await User.findOne({ cognitoId: payload.sub });

      if (!user) {
        user = new User({
          cognitoId: payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split("@")[0], // Fallback name if not available
        });
        await user.save();
      } else if (user.email !== payload.email) {
        user.email = payload.email;
        await user.save();
      }
    } catch (dbError) {
      console.error("Database error in auth middleware:", dbError);
    }

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
