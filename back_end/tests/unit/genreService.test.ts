import mongoose from "mongoose";
import { genreService } from "../../src/services/genreService";
import Genre from "../../src/models/genre.model";

// Mock the Genre model
jest.mock("../../src/models/genre.model");

describe("Genre Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllGenres", () => {
    it("should return all genres with pagination", async () => {
      // Mock data
      const mockGenres = [
        { id: 1, name: "Action" },
        { id: 2, name: "Comedy" },
      ];

      // Mock the Genre model methods
      (Genre.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockGenres),
        }),
      });

      (Genre.countDocuments as jest.Mock).mockResolvedValue(2);

      // Call the service
      const result = await genreService.getAllGenres(1, 10);

      // Assertions
      expect(result).toEqual({
        page: 1,
        results: mockGenres,
        total_pages: 1,
        total_results: 2,
      });
      expect(Genre.find).toHaveBeenCalled();
      expect(Genre.countDocuments).toHaveBeenCalled();
    });
  });

  describe("getGenre", () => {
    it("should return a genre by ID", async () => {
      // Mock data
      const mockGenre = { id: 1, name: "Action" };

      // Mock the Genre model methods
      (Genre.findOne as jest.Mock).mockResolvedValue(mockGenre);

      // Call the service
      const result = await genreService.getGenre(1);

      // Assertions
      expect(result).toEqual(mockGenre);
      expect(Genre.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return null if genre is not found", async () => {
      // Mock the Genre model methods
      (Genre.findOne as jest.Mock).mockResolvedValue(null);

      // Call the service
      const result = await genreService.getGenre(999);

      // Assertions
      expect(result).toBeNull();
      expect(Genre.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe("updateGenre", () => {
    it("should update a genre", async () => {
      // Mock data
      const mockGenreData = { name: "Updated Genre" };
      const mockUpdatedGenre = { id: 1, name: "Updated Genre" };

      // Mock the Genre model methods
      (Genre.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedGenre);

      // Call the service
      const result = await genreService.updateGenre(1, mockGenreData);

      // Assertions
      expect(result).toEqual(mockUpdatedGenre);
      expect(Genre.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        mockGenreData,
        { new: true }
      );
    });

    it("should return null if genre is not found", async () => {
      // Mock the Genre model methods
      (Genre.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      // Call the service
      const result = await genreService.updateGenre(999, {
        name: "Not Found",
      });

      // Assertions
      expect(result).toBeNull();
    });
  });

  describe("deleteGenre", () => {
    it("should delete a genre", async () => {
      // Mock the Genre model methods
      (Genre.findOneAndDelete as jest.Mock).mockResolvedValue({});

      // Call the service
      await genreService.deleteGenre(1);

      // Assertions
      expect(Genre.findOneAndDelete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
