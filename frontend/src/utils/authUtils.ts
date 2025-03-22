import { jwtDecode } from "jwt-decode";

/**
 * Decode the JWT token and extract the userId
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<{ sub: string }>(token); // Decode the token
    return decoded.sub; // Return the userId (sub claim)
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
