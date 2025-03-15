import Movie from "../models/movie.model";
import Genre from "../models/genre.model";
import { IMovie, IPaginatedResponse, ITMDBMovie } from "../interfaces";

export const movieService = {
  // Fetch all movies from the database
  getAllMovies: async (
    page = 1,
    limit = 10
  ): Promise<IPaginatedResponse<IMovie>> => {
    const skip = (page - 1) * limit;
    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .populate("genre_ids");
    const total = await Movie.countDocuments();

    return {
      page,
      results: movies,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    };
  },

  // Fetch a movie by ID from the database
  getMovieById: async (id: number): Promise<IMovie | null> => {
    const movie = await Movie.findOne({ id }).populate("genre_ids");
    return movie;
  },

  // Add a movie to the database, now accepting TMDB format
  addMovie: async (movieData: ITMDBMovie) => {
    // Get genre IDs from either genres array or genre_ids
    const genreIds = movieData.genres
      ? movieData.genres.map((g) => g.id)
      : movieData.genre_ids || [];

    // Find corresponding ObjectIds in the database
    const genreDocuments = await Genre.find({ id: { $in: genreIds } });
    const genreObjectIds = genreDocuments.map((genre) => genre._id);

    // Remove fields that don't match our model
    const { genre_ids, genres: genresData, ...movieDataClean } = movieData;

    // Create new movie with properly typed genre_ids
    const movie = new Movie({
      ...movieDataClean,
      genre_ids: genreObjectIds,
    });

    await movie.save();
    return movie;
  },

  // Update a movie in the database - can handle both TMDB and local formats
  updateMovie: async (
    id: number,
    movieData: Partial<IMovie> | Partial<ITMDBMovie>
  ): Promise<IMovie | null> => {
    // Clone to avoid modifying the original
    const updateData: any = { ...movieData };

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

    const movie = await Movie.findOneAndUpdate({ id }, updateData, {
      new: true,
    }).populate("genre_ids");

    return movie;
  },

  // Delete a movie from the database
  deleteMovie: async (id: number): Promise<void> => {
    await Movie.findOneAndDelete({ id });
  },
};