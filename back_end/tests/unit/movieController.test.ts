import { Request, Response, NextFunction } from "express";
import { movieService } from "../../src/services/movieService";
import {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../../src/controllers/movieController";
import { AppError } from "../../src/utils/errors";

// Mock the movieService
jest.mock("../../src/services/movieService");

// Mock the fileUpload middleware
jest.mock("../../src/middlewares/fileUpload", () => ({
  uploadMovieImages: jest.fn((req, res, next) => next()),
  processImageUploads: jest.fn((req, res, next) => next()),
  deleteFromS3: jest.fn(),
}));

describe("Movie Controller", () => {
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

  describe("getMovies", () => {
    it("should get all movies with default pagination", async () => {
      // Mock data
      const mockMovies = {
        page: 1,
        results: [{ id: 1, title: "Test Movie" }],
        total_pages: 1,
        total_results: 1,
      };

      // Mock the service
      (movieService.getAllMovies as jest.Mock).mockResolvedValue(mockMovies);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(movieService.getAllMovies).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should get all movies with custom pagination", async () => {
      // Mock data
      const mockMovies = {
        page: 2,
        results: [{ id: 3, title: "Another Test Movie" }],
        total_pages: 2,
        total_results: 3,
      };

      // Mock the service
      (movieService.getAllMovies as jest.Mock).mockResolvedValue(mockMovies);

      // Setup request
      mockRequest.query = { page: "2", limit: "2" };

      // Call the function
      await getMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(movieService.getAllMovies).toHaveBeenCalledWith(2, 2);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      // Mock the service to throw an error
      const error = new Error("Service error");
      (movieService.getAllMovies as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getMovieById", () => {
    it("should get a movie by ID", async () => {
      // Mock data
      const mockMovie = { id: 1, title: "Test Movie" };

      // Mock the service
      (movieService.getMovieById as jest.Mock).mockResolvedValue(mockMovie);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await getMovieById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(movieService.getMovieById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovie);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with AppError if movie is not found", async () => {
      // Mock the service to return null
      (movieService.getMovieById as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest.params = { id: "999" };

      // Call the function
      await getMovieById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe("Movie not found");
    });
  });

  describe("addMovie", () => {
    it("should handle errors when adding a movie", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (movieService.addMovie as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.body = { title: "Error Movie" };

      // Call the function
      const addMovieHandler = addMovie[addMovie.length - 1];
      await addMovieHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateMovie", () => {
    it("should handle errors when movie is not found", async () => {
      // Mock the service to return null
      (movieService.updateMovie as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest.params = { id: "999" };
      mockRequest.body = { title: "Not Found Movie" };

      // Call the function
      const updateMovieHandler = updateMovie[updateMovie.length - 1];
      await updateMovieHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteMovie", () => {
    it("should handle errors when deleting a movie", async () => {
      // Mock the service to throw an error
      const error = new Error("Database error");
      (movieService.deleteMovie as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await deleteMovie(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
