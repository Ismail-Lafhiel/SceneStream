import Movie from "../models/movie.model";
import Genre from "../models/genre.model";
import { IMovie, IPaginatedResponse, ITMDBMovie } from "../interfaces";
import { deleteFromS3 } from "../middlewares/fileUpload";

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

  // Add a movie to the database
  addMovie: async (movieData: ITMDBMovie) => {
    try {
      // Generate a unique ID
      const lastMovie = await Movie.findOne().sort({ id: -1 }); // Find the movie with the highest ID
      const newId = lastMovie ? lastMovie.id + 1 : 1; // Increment the highest ID by 1 or start with 1

      // Ensure genre_ids is an array of numbers
      const genreIds = Array.isArray(movieData.genre_ids)
        ? movieData.genre_ids
        : [];

      // Find corresponding ObjectIds in the database
      const genreDocuments = await Genre.find({ id: { $in: genreIds } });
      const genreObjectIds = genreDocuments.map((genre) => genre._id);

      // Remove fields that don't match our model
      const { genre_ids, genres: genresData, ...movieDataClean } = movieData;

      // Create new movie with properly typed genre_ids and generated ID
      const movie = new Movie({
        ...movieDataClean,
        id: newId, // Assign the generated ID
        genre_ids: genreObjectIds,
      });

      await movie.save();
      return movie;
    } catch (error) {
      console.error("Error in addMovie service:", error);
      throw error;
    }
  },

  // Update a movie in the database
  updateMovie: async (
    id: number,
    movieData: Partial<IMovie> | Partial<ITMDBMovie>
  ): Promise<IMovie | null> => {
    // Clone to avoid modifying the original
    const updateData: any = { ...movieData };

    // Handle genre IDs
    if ("genres" in updateData && updateData.genres) {
      const genreIds = updateData.genres.map((g: any) => g.id);
      const genreDocuments = await Genre.find({ id: { $in: genreIds } });
      const genreObjectIds = genreDocuments.map((genre) => genre._id);

      updateData.genre_ids = genreObjectIds;
      delete updateData.genres;
    } else if ("genre_ids" in updateData && updateData.genre_ids) {
      if (
        updateData.genre_ids.length > 0 &&
        typeof updateData.genre_ids[0] === "number"
      ) {
        const genreDocuments = await Genre.find({
          id: { $in: updateData.genre_ids },
        });
        updateData.genre_ids = genreDocuments.map((genre) => genre._id);
      }
    }

    // Find the existing movie to delete old files from S3
    const existingMovie = await Movie.findOne({ id });
    if (!existingMovie) {
      throw new Error("Movie not found");
    }

    // Delete old poster and backdrop from S3 if new ones are provided
    if (updateData.poster_path && existingMovie.poster_path) {
      await deleteFromS3(existingMovie.poster_path);
    }
    if (updateData.backdrop_path && existingMovie.backdrop_path) {
      await deleteFromS3(existingMovie.backdrop_path);
    }

    // Update the movie
    const movie = await Movie.findOneAndUpdate({ id }, updateData, {
      new: true,
    }).populate("genre_ids");

    return movie;
  },

  // Delete a movie from the database
  deleteMovie: async (id: number): Promise<void> => {
    const movie = await Movie.findOne({ id });
    if (!movie) {
      throw new Error("Movie not found");
    }

    // Delete poster and backdrop from S3
    if (movie.poster_path) {
      await deleteFromS3(movie.poster_path);
    }
    if (movie.backdrop_path) {
      await deleteFromS3(movie.backdrop_path);
    }

    // Delete the movie from the database
    await Movie.findOneAndDelete({ id });
  },
};
