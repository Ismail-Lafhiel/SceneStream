import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { verifyCognitoToken } from "../utils/verifyCognitoToken";

// Define a custom interface for the request with user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string | null; // Allow email to be null
    groups: string[];
  };
}

/**
 * Middleware to check if the user is authenticated.
 */
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
      new AppError(401, "You are not logged in. Please log in to get access.")
    );
  }

  try {
    // 2) Verify Cognito token
    const decoded = await verifyCognitoToken(token);

    // 3) Attach user to request object with type safety
    req.user = {
      id: decoded.sub || "", // Ensure it's a string
      email: decoded.email?.toString() || null, // Handle potential null/undefined email
      groups: Array.isArray(decoded["cognito:groups"]) ? decoded["cognito:groups"] : [],
    };

    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware to check if the user is in the ADMIN group in Cognito.
 */
export const checkAdminGroup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if the user is in the ADMIN group
  const isAdmin = req.user?.groups?.includes("ADMIN");

  if (!isAdmin) {
    return next(new AppError(403, "Forbidden"));
  }

  next();
};