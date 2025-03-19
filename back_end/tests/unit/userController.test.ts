import { Request, Response } from "express";
import { getUsers } from "../../src/controllers/userController";
import { getUsersData } from "../../src/services/userService";
import { AppError } from "../../src/utils/errors";

// Mock the userService
jest.mock("../../src/services/userService");

describe("UserController", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe("getUsers", () => {
    it("should return users data", async () => {
      const mockUsers = [
        { _id: "1", email: "user1@example.com", name: "User 1", role: "USER" },
      ];

      (getUsersData as jest.Mock).mockResolvedValue(mockUsers);

      await getUsers(req, res);

      expect(getUsersData).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should throw an AppError if fetching users fails", async () => {
      (getUsersData as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(getUsers(req, res)).rejects.toThrow(AppError);
      await expect(getUsers(req, res)).rejects.toMatchObject({
        statusCode: 500,
        message: "Failed to fetch users data",
      });
    });
  });
});
