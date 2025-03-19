import mongoose from "mongoose";
import { movieService } from "../../src/services/movieService";
import Movie from "../../src/models/movie.model";
import Genre from "../../src/models/genre.model";
import { deleteFromS3 } from "../../src/middlewares/fileUpload";

// Mock mongoose models
jest.mock("../../src/models/movie.model");
jest.mock("../../src/models/genre.model");

// Mock the S3 file upload middleware
jest.mock("../../src/middlewares/fileUpload", () => ({
  deleteFromS3: jest.fn(),
}));

describe("Movie Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMovies", () => {
    it("should return all movies with pagination", async () => {
      // Mock data
      const mockMovies = [
        { id: 1, title: "Test Movie 1" },
        { id: 2, title: "Test Movie 2" },
      ];

      // Mock the Movie model methods
      (Movie.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockMovies),
          }),
        }),
      });

      (Movie.countDocuments as jest.Mock).mockResolvedValue(2);

      // Call the service
      const result = await movieService.getAllMovies(1, 10);

      // Assertions
      expect(result).toEqual({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 2,
      });
      expect(Movie.find).toHaveBeenCalled();
      expect(Movie.countDocuments).toHaveBeenCalled();
    });
  });

  describe("getMovieById", () => {
    it("should return a movie by ID", async () => {
      // Mock data
      const mockMovie = { id: 1, title: "Test Movie" };

      // Mock the Movie model methods
      (Movie.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMovie),
      });

      // Call the service
      const result = await movieService.getMovieById(1);

      // Assertions
      expect(result).toEqual(mockMovie);
      expect(Movie.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return null if movie not found", async () => {
      // Mock the Movie model methods
      (Movie.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      // Call the service
      const result = await movieService.getMovieById(999);

      // Assertions
      expect(result).toBeNull();
      expect(Movie.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe("updateMovie", () => {
    it("should update a movie", async () => {
      // Mock data
      const movieId = 1;
      const updateData = {
        title: "Updated Movie",
        overview: "Updated overview",
        genre_ids: [1, 3],
      };

      const mockExistingMovie = {
        id: movieId,
        title: "Old Movie",
        poster_path: "old-poster.jpg",
        backdrop_path: "old-backdrop.jpg",
      };

      const mockGenres = [
        { _id: "genre1_id", id: 1 },
        { _id: "genre3_id", id: 3 },
      ];

      const mockUpdatedMovie = {
        id: movieId,
        title: "Updated Movie",
        overview: "Updated overview",
        genre_ids: ["genre1_id", "genre3_id"],
      };

      // Mock mongoose methods
      (Movie.findOne as jest.Mock).mockResolvedValue(mockExistingMovie);
      (Genre.find as jest.Mock).mockResolvedValue(mockGenres);

      (Movie.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedMovie),
      });

      // Call the service
      const result = await movieService.updateMovie(movieId, updateData);

      // Assertions
      expect(result).toEqual(mockUpdatedMovie);
      expect(Movie.findOne).toHaveBeenCalledWith({ id: movieId });
      expect(Genre.find).toHaveBeenCalledWith({ id: { $in: [1, 3] } });
      expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
        { id: movieId },
        expect.objectContaining({
          title: "Updated Movie",
          overview: "Updated overview",
          genre_ids: ["genre1_id", "genre3_id"],
        }),
        { new: true }
      );
      expect(deleteFromS3).not.toHaveBeenCalled();
    });

    it("should delete old files from S3 when updating images", async () => {
      // Mock data
      const movieId = 1;
      const updateData = {
        title: "Updated Movie",
        poster_path: "new-poster.jpg",
        backdrop_path: "new-backdrop.jpg",
      };

      const mockExistingMovie = {
        id: movieId,
        title: "Old Movie",
        poster_path: "old-poster.jpg",
        backdrop_path: "old-backdrop.jpg",
      };

      const mockUpdatedMovie = {
        id: movieId,
        title: "Updated Movie",
        poster_path: "new-poster.jpg",
        backdrop_path: "new-backdrop.jpg",
      };

      // Mock mongoose methods
      (Movie.findOne as jest.Mock).mockResolvedValue(mockExistingMovie);

      (Movie.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedMovie),
      });

      // Call the service
      const result = await movieService.updateMovie(movieId, updateData);

      // Assertions
      expect(result).toEqual(mockUpdatedMovie);
      expect(deleteFromS3).toHaveBeenCalledWith("old-poster.jpg");
      expect(deleteFromS3).toHaveBeenCalledWith("old-backdrop.jpg");
    });

    it("should throw an error if movie is not found", async () => {
      // Mock Movie.findOne to return null
      (Movie.findOne as jest.Mock).mockResolvedValue(null);

      // Call the service and expect it to throw
      await expect(
        movieService.updateMovie(999, { title: "Not Found" })
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("deleteMovie", () => {
    it("should delete a movie and its associated files", async () => {
      // Mock data
      const movieId = 1;
      const mockMovie = {
        id: movieId,
        title: "Movie to Delete",
        poster_path: "poster.jpg",
        backdrop_path: "backdrop.jpg",
      };

      // Mock mongoose methods
      (Movie.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (Movie.findOneAndDelete as jest.Mock).mockResolvedValue({});

      // Call the service
      await movieService.deleteMovie(movieId);

      // Assertions
      expect(Movie.findOne).toHaveBeenCalledWith({ id: movieId });
      expect(deleteFromS3).toHaveBeenCalledWith("poster.jpg");
      expect(deleteFromS3).toHaveBeenCalledWith("backdrop.jpg");
      expect(Movie.findOneAndDelete).toHaveBeenCalledWith({ id: movieId });
    });

    it("should throw an error if movie is not found", async () => {
      // Mock Movie.findOne to return null
      (Movie.findOne as jest.Mock).mockResolvedValue(null);

      // Call the service and expect it to throw
      await expect(movieService.deleteMovie(999)).rejects.toThrow(
        "Movie not found"
      );
    });

    it("should handle movie with no image files", async () => {
      // Mock data
      const movieId = 1;
      const mockMovie = {
        id: movieId,
        title: "Movie to Delete",
      };

      // Mock mongoose methods
      (Movie.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (Movie.findOneAndDelete as jest.Mock).mockResolvedValue({});

      // Call the service
      await movieService.deleteMovie(movieId);

      // Assertions
      expect(Movie.findOne).toHaveBeenCalledWith({ id: movieId });
      expect(deleteFromS3).not.toHaveBeenCalled();
      expect(Movie.findOneAndDelete).toHaveBeenCalledWith({ id: movieId });
    });
  });
});
