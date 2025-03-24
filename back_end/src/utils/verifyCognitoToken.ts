import { CognitoJwtVerifier } from "aws-jwt-verify";
import { AppError } from "./errors";
import config from "../config/config";

// Verifier for the Cognito User Pool
const verifier = CognitoJwtVerifier.create({
  userPoolId: config.aws.userPoolId,
  tokenUse: "id",
  clientId: config.aws.clientId,
});

// Verifier for access tokens
const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: config.aws.userPoolId,
  tokenUse: "access",
  clientId: config.aws.clientId,
});

interface ErrorWithMessage {
  message: string;
}

// Type guard function to check if the error has a message property
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

// Function to get error message safely
function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return String(error);
}

/**
 * Verify the Cognito token and return the decoded payload.
 * This function attempts to verify as both ID and access tokens.
 */
export const verifyCognitoToken = async (token: string) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      const tokenSample = token.substring(0, 10) + "...";
      console.log(`Verifying token: ${tokenSample}`);
    }

    let payload;
    try {
      payload = await verifier.verify(token);
      console.log("ID token verified successfully for user:", payload.sub);
    } catch (idTokenError) {
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Token verification error:", errorMessage);

    // Handle specific error cases
    if (errorMessage.includes("expired")) {
      throw new AppError(401, "Your session has expired. Please log in again.");
    } else if (errorMessage.includes("Invalid token")) {
      throw new AppError(
        401,
        "Invalid authentication token. Please log in again."
      );
    } else {
      throw new AppError(401, `Authentication error: ${errorMessage}`);
    }
  }
};