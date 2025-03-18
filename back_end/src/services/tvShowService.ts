import TVShow from "../models/tvShow.model";
import Genre from "../models/genre.model";
import { ITVShow, IPaginatedResponse, ITMDBTVShow } from "../interfaces";
import { deleteFromS3 } from "../middlewares/fileUpload";

export const tvService = {
  // Fetch all TV shows from the database
  getAllTVShows: async (
    page = 1,
    limit = 10
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const skip = (page - 1) * limit;
    const tvShows = await TVShow.find()
      .skip(skip)
      .limit(limit)
      .populate("genre_ids");
    const total = await TVShow.countDocuments();

    return {
      page,
      results: tvShows,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    };
  },

  // Add a TV show to the database
  addTVShow: async (tvShowData: ITMDBTVShow) => {
    try {
      // Generate a unique ID
      const lastTVShow = await TVShow.findOne().sort({ id: -1 });
      const newId = lastTVShow ? lastTVShow.id + 1 : 1;

      // Get genre ids from either genres array or genre_ids
      const genreIds = tvShowData.genres
        ? tvShowData.genres.map((g) => g.id)
        : tvShowData.genre_ids || [];

      // Find corresponding ObjectIds in the database
      const genreDocuments = await Genre.find({ id: { $in: genreIds } });
      const genreObjectIds = genreDocuments.map((genre) => genre._id);

      // Remove fields that don't match our model
      const { genre_ids, genres: genresData, ...tvShowDataClean } = tvShowData;

      const tvShow = new TVShow({
        ...tvShowDataClean,
        id: newId,
        genre_ids: genreObjectIds,
      });

      await tvShow.save();
      return tvShow;
    } catch (error) {
      console.error("Error in addTVShow service:", error);
      throw error;
    }
  },

  // Fetch a TV show by ID from the database
  getTVShowById: async (id: number): Promise<ITVShow | null> => {
    const tvShow = await TVShow.findOne({ id }).populate("genre_ids");
    return tvShow;
  },

  // Update a TV show in the database
  updateTVShow: async (
    id: number,
    tvShowData: Partial<ITVShow> | Partial<ITMDBTVShow>
  ): Promise<ITVShow | null> => {
    // Clone to avoid modifying the original
    const updateData: any = { ...tvShowData };

    // Handle genre ids
    if ("genre_ids" in updateData && updateData.genre_ids) {
      // genre_ids is an array of numbers
      const genreIds = updateData.genre_ids
        .map((genre: any) => (typeof genre === "object" ? genre.id : genre))
        .filter((id: any) => !isNaN(id));

      // Find corresponding ObjectIds in the database
      const genreDocuments = await Genre.find({ id: { $in: genreIds } });
      const genreObjectIds = genreDocuments.map((genre) => genre._id);

      updateData.genre_ids = genreObjectIds;
    }

    // Find the existing TV show to delete old files from S3
    const existingTVShow = await TVShow.findOne({ id });
    if (!existingTVShow) {
      throw new Error("TV show not found");
    }

    // Delete old poster and backdrop from S3 if new ones are provided
    if (updateData.poster_path && existingTVShow.poster_path) {
      await deleteFromS3(existingTVShow.poster_path);
    }
    if (updateData.backdrop_path && existingTVShow.backdrop_path) {
      await deleteFromS3(existingTVShow.backdrop_path);
    }

    // Update the TV show
    const tvShow = await TVShow.findOneAndUpdate({ id }, updateData, {
      new: true,
    }).populate("genre_ids");

    return tvShow;
  },

  // Delete a TV show from the database
  deleteTVShow: async (id: number): Promise<void> => {
    const tvShow = await TVShow.findOne({ id });
    if (!tvShow) {
      throw new Error("TV show not found");
    }

    // Delete poster and backdrop from S3
    if (tvShow.poster_path) {
      await deleteFromS3(tvShow.poster_path);
    }
    if (tvShow.backdrop_path) {
      await deleteFromS3(tvShow.backdrop_path);
    }

    // Delete the TV show from the database
    await TVShow.findOneAndDelete({ id });
  },
};
