import TVShow from "../models/tvShow.model";
import Genre from "../models/genre.model";
import { ITVShow, IPaginatedResponse, ITMDBTVShow } from "../interfaces";

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

  // Add a TV show to the database, now accepting TMDB format
  addTVShow: async (tvShowData: ITMDBTVShow) => {
    // Get genre IDs from either genres array or genre_ids
    const genreIds = tvShowData.genres
      ? tvShowData.genres.map((g) => g.id)
      : tvShowData.genre_ids || [];

    // Find corresponding ObjectIds in the database
    const genreDocuments = await Genre.find({ id: { $in: genreIds } });
    const genreObjectIds = genreDocuments.map((genre) => genre._id);

    // Remove fields that don't match our model
    const { genre_ids, genres: genresData, ...tvShowDataClean } = tvShowData;

    // Create new TV show with properly typed genre_ids
    const tvShow = new TVShow({
      ...tvShowDataClean,
      genre_ids: genreObjectIds,
    });

    await tvShow.save();
    return tvShow;
  },

  // Fetch a TV show by ID from the database
  getTVShowById: async (id: number): Promise<ITVShow | null> => {
    const tvShow = await TVShow.findOne({ id }).populate("genre_ids");
    return tvShow;
  },

  // Update a TV show in the database - can handle both TMDB and local formats
  updateTVShow: async (
    id: number,
    tvShowData: Partial<ITVShow> | Partial<ITMDBTVShow>
  ): Promise<ITVShow | null> => {
    // Clone to avoid modifying the original
    const updateData: any = { ...tvShowData };

    // Handle genre IDs - check both possible formats from TMDB API
    if ("genres" in updateData && updateData.genres) {
      // Handle 'genres' array of objects format
      const genreIds = updateData.genres.map((g: any) => g.id);
      const genreDocuments = await Genre.find({ id: { $in: genreIds } });
      const genreObjectIds = genreDocuments.map((genre) => genre._id);

      // Replace with ObjectIds and remove 'genres' field
      updateData.genre_ids = genreObjectIds;
      delete updateData.genres;
    } else if ("genre_ids" in updateData && updateData.genre_ids) {
      // Check if these are already ObjectIds or just number IDs
      if (
        updateData.genre_ids.length > 0 &&
        typeof updateData.genre_ids[0] === "number"
      ) {
        // If they're numbers, convert to ObjectIds
        const genreDocuments = await Genre.find({ id: { $in: updateData.genre_ids } });
        updateData.genre_ids = genreDocuments.map((genre) => genre._id);
      }
    }

    const tvShow = await TVShow.findOneAndUpdate({ id }, updateData, {
      new: true,
    }).populate("genre_ids");

    return tvShow;
  },

  // Delete a TV show from the database
  deleteTVShow: async (id: number): Promise<void> => {
    await TVShow.findOneAndDelete({ id });
  },
};