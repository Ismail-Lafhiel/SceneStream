// utils/verifyCognitoToken.js
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { ApiError } = require("./errors");
const { aws } = require("../config/config");

// Create a verifier for the Cognito User Pool
const verifier = CognitoJwtVerifier.create({
  userPoolId: aws.userPoolId,
  tokenUse: "id", // Validate ID tokens
  clientId: aws.clientId, // Your Cognito App Client ID
});

/**
 * Verify the Cognito ID token and return the decoded payload.
 */
module.exports = async (token) => {
  try {
    const payload = await verifier.verify(token); // Validate the token
    return payload;
  } catch (error) {
    throw new ApiError(401, "Invalid token. Please log in again.");
  }
};
