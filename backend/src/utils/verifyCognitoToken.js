// utils/verifyCognitoToken.js
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { ApiError } = require("./errors");
const { aws } = require("../config/config");

// verifier for the Cognito User Pool
const verifier = CognitoJwtVerifier.create({
  userPoolId: aws.userPoolId,
  tokenUse: "id", // Validate ID tokens
  clientId: aws.clientId,
});
// verifier for access tokens
const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: aws.userPoolId,
  tokenUse: "access", // Validate access tokens
  clientId: aws.clientId,
});

/**
 * Verify the Cognito token and return the decoded payload.
 * This function attempts to verify as both ID and access tokens.
 */
module.exports = async (token) => {
  try {
    // For security in production, avoid logging tokens even partially
    if (process.env.NODE_ENV !== "production") {
      const tokenSample = token.substring(0, 10) + "...";
      console.log(`Verifying token: ${tokenSample}`);
    }

    let payload;
    try {
      // First try to verify as ID token
      payload = await verifier.verify(token);
      console.log("ID token verified successfully for user:", payload.sub);
    } catch (idTokenError) {
      // If ID token verification fails, try as access token
      try {
        payload = await accessTokenVerifier.verify(token);
        console.log(
          "Access token verified successfully for user:",
          payload.sub
        );
      } catch (accessTokenError) {
        throw idTokenError;
      }
    }

    return payload;
  } catch (error) {
    console.error("Token verification error:", error.message);

    // Handle specific error cases
    if (error.message.includes("expired")) {
      throw new ApiError(401, "Your session has expired. Please log in again.");
    } else if (error.message.includes("Invalid token")) {
      throw new ApiError(
        401,
        "Invalid authentication token. Please log in again."
      );
    } else {
      throw new ApiError(401, `Authentication error: ${error.message}`);
    }
  }
};
