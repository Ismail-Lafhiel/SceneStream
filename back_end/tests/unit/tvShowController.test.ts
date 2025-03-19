import { Request, Response, NextFunction } from "express";
import { tvService } from "../../src/services/tvShowService";
import {
  getTVShows,
  getTVShowById,
  addTVShow,
  updateTVShow,
  deleteTVShow,
} from "../../src/controllers/tvShowController";
import { AppError } from "../../src/utils/errors";

// Mock the tvService
jest.mock("../../src/services/tvShowService");

// Mock the fileUpload middleware
jest.mock("../../src/middlewares/fileUpload", () => ({
  uploadMovieImages: jest.fn((req, res, next) => next()),
  processImageUploads: jest.fn((req, res, next) => next()),
  deleteFromS3: jest.fn(),
}));

describe("TV Show Controller", () => {
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

  describe("getTVShows", () => {
    it("should get all TV shows with default pagination", async () => {
      // Mock data
      const mockTVShows = {
        page: 1,
        results: [{ id: 1, name: "Test TV Show" }],
        total_pages: 1,
        total_results: 1,
      };

      // Mock the service
      (tvService.getAllTVShows as jest.Mock).mockResolvedValue(mockTVShows);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getTVShows(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(tvService.getAllTVShows).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTVShows);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      // Mock the service to throw an error
      const error = new Error("Service error");
      (tvService.getAllTVShows as jest.Mock).mockRejectedValue(error);

      // Setup request
      mockRequest.query = {};

      // Call the function
      await getTVShows(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getTVShowById", () => {
    it("should get a TV show by ID", async () => {
      // Mock data
      const mockTVShow = { id: 1, name: "Test TV Show" };

      // Mock the service
      (tvService.getTVShowById as jest.Mock).mockResolvedValue(mockTVShow);

      // Setup request
      mockRequest.params = { id: "1" };

      // Call the function
      await getTVShowById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(tvService.getTVShowById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTVShow);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with AppError if TV show is not found", async () => {
      // Mock the service to return null
      (tvService.getTVShowById as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest.params = { id: "999" };

      // Call the function
      await getTVShowById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe("TV show not found");
    });
  });
});
