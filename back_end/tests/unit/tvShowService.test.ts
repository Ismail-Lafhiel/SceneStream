import { tvService } from "../../src/services/tvShowService";
import TVShow from "../../src/models/tvShow.model";
import Genre from "../../src/models/genre.model";
import { deleteFromS3 } from "../../src/middlewares/fileUpload";

// Mock mongoose models
jest.mock("../../src/models/tvShow.model");
jest.mock("../../src/models/genre.model");

// Mock the S3 file upload middleware
jest.mock("../../src/middlewares/fileUpload", () => ({
  deleteFromS3: jest.fn(),
}));

describe("TV Show Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTVShows", () => {
    it("should return all TV shows with pagination", async () => {
      // Mock data
      const mockTVShows = [
        { id: 1, name: "Test TV Show 1" },
        { id: 2, name: "Test TV Show 2" },
      ];

      // Mock the TVShow model methods
      (TVShow.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockTVShows),
          }),
        }),
      });

      (TVShow.countDocuments as jest.Mock).mockResolvedValue(2);

      // Call the service
      const result = await tvService.getAllTVShows(1, 10);

      // Assertions
      expect(result).toEqual({
        page: 1,
        results: mockTVShows,
        total_pages: 1,
        total_results: 2,
      });
      expect(TVShow.find).toHaveBeenCalled();
      expect(TVShow.countDocuments).toHaveBeenCalled();
    });
  });

  describe("getTVShowById", () => {
    it("should return a TV show by ID", async () => {
      // Mock data
      const mockTVShow = { id: 1, name: "Test TV Show" };

      // Mock the TVShow model methods
      (TVShow.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTVShow),
      });

      // Call the service
      const result = await tvService.getTVShowById(1);

      // Assertions
      expect(result).toEqual(mockTVShow);
      expect(TVShow.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return null if TV show not found", async () => {
      // Mock the TVShow model methods
      (TVShow.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      // Call the service
      const result = await tvService.getTVShowById(999);

      // Assertions
      expect(result).toBeNull();
      expect(TVShow.findOne).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe("updateTVShow", () => {
    it("should update a TV show", async () => {
      // Mock data
      const tvShowId = 1;
      const updateData = {
        name: "Updated TV Show",
        overview: "Updated overview",
        genre_ids: [1, 3],
      };

      const mockExistingTVShow = {
        id: tvShowId,
        name: "Old TV Show",
        poster_path: "old-poster.jpg",
        backdrop_path: "old-backdrop.jpg",
      };

      const mockGenres = [
        { _id: "genre1_id", id: 1 },
        { _id: "genre3_id", id: 3 },
      ];

      const mockUpdatedTVShow = {
        id: tvShowId,
        name: "Updated TV Show",
        overview: "Updated overview",
        genre_ids: ["genre1_id", "genre3_id"],
      };

      // Mock mongoose methods
      (TVShow.findOne as jest.Mock).mockResolvedValue(mockExistingTVShow);
      (Genre.find as jest.Mock).mockResolvedValue(mockGenres);

      (TVShow.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedTVShow),
      });

      // Call the service
      const result = await tvService.updateTVShow(tvShowId, updateData);

      // Assertions
      expect(result).toEqual(mockUpdatedTVShow);
      expect(TVShow.findOne).toHaveBeenCalledWith({ id: tvShowId });
      expect(Genre.find).toHaveBeenCalledWith({ id: { $in: [1, 3] } });
      expect(TVShow.findOneAndUpdate).toHaveBeenCalledWith(
        { id: tvShowId },
        expect.objectContaining({
          name: "Updated TV Show",
          overview: "Updated overview",
          genre_ids: ["genre1_id", "genre3_id"],
        }),
        { new: true }
      );
      expect(deleteFromS3).not.toHaveBeenCalled(); // No S3 deletion should occur
    });

    it("should delete old files from S3 when updating images", async () => {
      // Mock data
      const tvShowId = 1;
      const updateData = {
        name: "Updated TV Show",
        poster_path: "new-poster.jpg",
        backdrop_path: "new-backdrop.jpg",
      };

      const mockExistingTVShow = {
        id: tvShowId,
        name: "Old TV Show",
        poster_path: "old-poster.jpg",
        backdrop_path: "old-backdrop.jpg",
      };

      const mockUpdatedTVShow = {
        id: tvShowId,
        name: "Updated TV Show",
        poster_path: "new-poster.jpg",
        backdrop_path: "new-backdrop.jpg",
      };

      // Mock mongoose methods
      (TVShow.findOne as jest.Mock).mockResolvedValue(mockExistingTVShow);

      (TVShow.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUpdatedTVShow),
      });

      // Call the service
      const result = await tvService.updateTVShow(tvShowId, updateData);

      // Assertions
      expect(result).toEqual(mockUpdatedTVShow);
      expect(deleteFromS3).toHaveBeenCalledWith("old-poster.jpg");
      expect(deleteFromS3).toHaveBeenCalledWith("old-backdrop.jpg");
    });

    it("should throw an error if TV show is not found", async () => {
      // Mock TVShow.findOne to return null
      (TVShow.findOne as jest.Mock).mockResolvedValue(null);

      // Call the service and expect it to throw
      await expect(
        tvService.updateTVShow(999, { name: "Not Found" })
      ).rejects.toThrow("TV show not found");
    });
  });
});
