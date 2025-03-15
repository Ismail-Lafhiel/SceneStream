import mongoose, { Types } from "mongoose";
import { movieService, tvService, genreService } from "../services/tmdbService";
import Movie from "../models/movie.model";
import TVShow from "../models/tvShow.model";
import Genre from "../models/genre.model";
import config from "../config/config";
import { ITMDBMovie, ITMDBTVShow } from "../interfaces";

const { mongoURI } = config;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Seed the database
const seedDatabase = async () => {
  try {
    // Ensure seeding only runs in development
    if (process.env.NODE_ENV !== "development") {
      console.error("Seeding is only allowed in development environment.");
      process.exit(1);
    }

    // Fetch and save genres
    const movieGenres = await genreService.getMovieGenres();
    const tvGenres = await genreService.getTvGenres();
    const allGenres = [...movieGenres, ...tvGenres];

    for (const genre of allGenres) {
      await Genre.findOneAndUpdate({ id: genre.id }, genre, { upsert: true });
    }
    console.log("Genres seeded successfully.");

    // Fetch and save popular movies
    const popularMovies = await movieService.getPopularMovies();
    console.log(`Seeding ${popularMovies.results.length} movies...`);

    const moviesToSave = await Promise.all(
      popularMovies.results.map(async (movie) => {
        try {
          const movieDetails = await movieService.getMovieDetails(movie.id) as ITMDBMovie;
          
          // Get genre IDs from either genres array or genre_ids
          const genreIds = movieDetails.genres
            ? movieDetails.genres.map((g) => g.id)
            : (movieDetails.genre_ids || []);
            
          console.log(`Movie ${movieDetails.title} (${movie.id}) genres:`, genreIds);
          
          const genres = await Genre.find({ id: { $in: genreIds } });
          console.log(`Found ${genres.length} matching genres in database`);
          
          const genreObjectIds = genres.map((genre) => genre._id);

          // Remove genre_ids and genres to avoid type conflicts
          const { genre_ids, genres: _, ...movieWithoutGenres } = movieDetails;

          return {
            updateOne: {
              filter: { id: movieDetails.id },
              update: { 
                $set: { 
                  ...movieWithoutGenres,
                  genre_ids: genreObjectIds 
                } 
              },
              upsert: true,
            },
          } as const;  // Using const assertion for type stability
        } catch (error) {
          console.error(`Error processing movie ${movie.id}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and type assert the array
    const validMovieOperations = moviesToSave.filter((op): op is NonNullable<typeof op> => op !== null);
    
    if (validMovieOperations.length > 0) {
      await Movie.bulkWrite(validMovieOperations);
      console.log(`${validMovieOperations.length} movies seeded successfully.`);
    } else {
      console.log("No valid movies to seed.");
    }

    // Fetch and save popular TV shows
    const popularTVShows = await tvService.getPopularTvShows();
    console.log(`Seeding ${popularTVShows.results.length} TV shows...`);

    const tvShowsToSave = await Promise.all(
      popularTVShows.results.map(async (tvShow) => {
        try {
          const tvShowDetails = await tvService.getTvShowDetails(tvShow.id) as ITMDBTVShow;
          
          // Get genre IDs from either genres array or genre_ids
          const genreIds = tvShowDetails.genres
            ? tvShowDetails.genres.map((g) => g.id)
            : (tvShowDetails.genre_ids || []);
            
          console.log(`TV Show ${tvShowDetails.name} (${tvShow.id}) genres:`, genreIds);
          
          const genres = await Genre.find({ id: { $in: genreIds } });
          console.log(`Found ${genres.length} matching genres in database`);
          
          const genreObjectIds = genres.map((genre) => genre._id);

          // Remove genre_ids and genres to avoid type conflicts
          const { genre_ids, genres: _, ...tvShowWithoutGenres } = tvShowDetails;

          return {
            updateOne: {
              filter: { id: tvShowDetails.id },
              update: { 
                $set: { 
                  ...tvShowWithoutGenres,
                  genre_ids: genreObjectIds 
                } 
              },
              upsert: true,
            },
          } as const;  // Using const assertion for type stability
        } catch (error) {
          console.error(`Error processing TV show ${tvShow.id}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and type assert the array
    const validTvShowOperations = tvShowsToSave.filter((op): op is NonNullable<typeof op> => op !== null);
    
    if (validTvShowOperations.length > 0) {
      await TVShow.bulkWrite(validTvShowOperations);
      console.log(`${validTvShowOperations.length} TV shows seeded successfully.`);
    } else {
      console.log("No valid TV shows to seed.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};