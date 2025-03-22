import { syncUsersFromCognito, getUsersData } from "../../src/services/userService";
import User from "../../src/models/user.model";
import { AppError } from "../../src/utils/errors";

// Mock the Cognito client and its methods
jest.mock("@aws-sdk/client-cognito-identity-provider", () => ({
  CognitoIdentityProviderClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  ListUsersCommand: jest.fn(),
  AdminListGroupsForUserCommand: jest.fn(),
}));

// Mock the User model
jest.mock("../../src/models/user.model");

// Mock console.error to prevent polluting test output
jest.spyOn(console, 'error').mockImplementation(() => {});

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsersData", () => {
    it("should fetch users from MongoDB", async () => {
      const mockUsers = [
        { _id: "1", email: "user1@example.com", name: "User 1", role: "USER" },
        { _id: "2", email: "user2@example.com", name: "User 2", role: "ADMIN" },
      ];

      // Mock User.find to return mockUsers
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const users = await getUsersData();

      expect(User.find).toHaveBeenCalledWith({});
      expect(users).toEqual(mockUsers);
    });

    it("should throw an AppError if fetching users fails", async () => {
      // Mock User.find to throw an error
      (User.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      // Use try/catch to verify the correct error is thrown
      try {
        await getUsersData();
        // If we reach here, the test should fail
        fail('Expected getUsersData to throw an error but it did not');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        //@ts-ignore
        expect(error.statusCode).toBe(500);
        //@ts-ignore
        expect(error.message).toBe('Failed to fetch users data');
      }
    });
  });
});