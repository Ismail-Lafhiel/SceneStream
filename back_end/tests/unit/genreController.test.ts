import { Request, Response, NextFunction } from "express";
import { genreService } from "../../src/services/genreService";
import {
  getGenres,
  getGenre,
  addGenre,
  updateGenre,
  deleteGenre,
} from "../../src/controllers/genreController";
import { AppError } from "../../src/utils/errors";

// Mock the genreService
jest.mock("../../src/services/genreService");

describe("Genre Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getGenres", () => {
    it("should get all genres with default pagination", async () => {
      // Mock data
      const mockGenres = {
        page: 1,
        results: [{ id: 1, name: "Action" }],
        total_pages: 1,
        total_results: 1,
      };

      // Mock the service
      (genreService.getAllGenres as jest.Mock).mockResolvedValue(mockGenres);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getGenres(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(genreService.getAllGenres).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenres);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching genres", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (genreService.getAllGenres as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getGenres(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Failed to fetch genres",
      });
    });
  });

  describe("getGenre", () => {
    it("should get a genre by ID", async () => {
      // Mock data
      const mockGenre = { id: 1, name: "Action" };

      // Mock the service
      (genreService.getGenre as jest.Mock).mockResolvedValue(mockGenre);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await getGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(genreService.getGenre).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenre);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching a genre", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (genreService.getGenre as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await getGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Failed to fetch genre",
      });
    });

    it("should return 404 if genre is not found", async () => {
      // Mock the service to return null
      (genreService.getGenre as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest.params = { id: "999" };

      // Call the function
      await getGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe("Genre not found");
    });
  });

  describe("addGenre", () => {
    it("should add a new genre", async () => {
      // Mock data
      const mockGenreData = { name: "Drama" };
      const mockSavedGenre = { id: 3, name: "Drama" };

      // Mock the service
      (genreService.addGenre as jest.Mock).mockResolvedValue(mockSavedGenre);

      // Setup request
      mockRequest.body = mockGenreData;

      // Call the function
      await addGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(genreService.addGenre).toHaveBeenCalledWith(mockGenreData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSavedGenre);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors when adding a genre", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (genreService.addGenre as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.body = { name: "Error Genre" };

      // Call the function
      await addGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Failed to create genre",
        error,
      });
    });
  });

  describe("updateGenre", () => {
    it("should update a genre", async () => {
      // Mock data
      const mockGenreData = { name: "Updated Genre" };
      const mockUpdatedGenre = { id: 1, name: "Updated Genre" };

      // Mock the service
      (genreService.updateGenre as jest.Mock).mockResolvedValue(
        mockUpdatedGenre
      );

      // Setup request
      mockRequest.params = { id: "1" };
      mockRequest.body = mockGenreData;

      // Call the function
      await updateGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(genreService.updateGenre).toHaveBeenCalledWith(1, mockGenreData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedGenre);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle not found when updating a genre", async () => {
      // Mock the service to return null
      (genreService.updateGenre as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Not Found Genre" };

      // Call the function
      await updateGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe("Genre not found");
    });

    it("should handle errors when updating a genre", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (genreService.updateGenre as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Error Genre" };

      // Call the function
      await updateGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteGenre", () => {
    it("should delete a genre", async () => {
      // Mock the service
      (genreService.deleteGenre as jest.Mock).mockResolvedValue(undefined);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await deleteGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(genreService.deleteGenre).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors when deleting a genre", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (genreService.deleteGenre as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await deleteGenre(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
