import mongoose, { Types } from "mongoose";
import { movieService, tvService, genreService } from "../services/tmdbService";
import Movie from "../models/movie.model";
import TVShow from "../models/tvShow.model";
import Genre from "../models/genre.model";
import config from "../config/config";
import { ITMDBMovie, ITMDBTVShow } from "../interfaces";

const { mongoURI } = config;
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BATCH_SIZE = 20;
const DELAY_MS = 1000;

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

process.on("exit", async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
});

const ensureImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  return path.startsWith(BASE_IMAGE_URL) ? path : `${BASE_IMAGE_URL}${path}`;
};

const processInBatches = async <T>(
  operations: T[],
  model: mongoose.Model<any>,
  mediaType: string
) => {
  for (let i = 0; i < operations.length; i += BATCH_SIZE) {
    const batch = operations.slice(i, i + BATCH_SIZE);
    try {
      //@ts-ignore
      await model.bulkWrite(batch);
      console.log(
        `Processed ${i + batch.length}/${
          operations.length
        } ${mediaType} entries`
      );
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    } catch (batchError) {
      console.error(
        `Error processing ${mediaType} batch ${i / BATCH_SIZE + 1}:`,
        batchError
      );
    }
  }
};

const seedDatabase = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Seed script cannot run in production!");
    }

    if (process.env.NODE_ENV !== "development") {
      console.error("Seeding is only allowed in development environment.");
      process.exit(1);
    }

    // Seed Genres
    const movieGenres = await genreService.getMovieGenres();
    const tvGenres = await genreService.getTvGenres();
    const allGenres = [...movieGenres, ...tvGenres];

    const genreOperations = allGenres.map((genre) => ({
      updateOne: {
        filter: { id: genre.id },
        update: { $set: genre },
        upsert: true,
      },
    }));

    await Genre.bulkWrite(genreOperations);
    console.log(`Seeded ${allGenres.length} genres`);

    // Seed Movies
    const popularMovies = await movieService.getPopularMovies();
    console.log(`Processing ${popularMovies.results.length} movies...`);

    const movieOperations = await Promise.all(
      popularMovies.results.map(async (movie) => {
        try {
          const movieDetails = (await movieService.getMovieDetails(
            movie.id
          )) as ITMDBMovie;
          const genreIds =
            movieDetails.genres?.map((g) => g.id) ||
            movieDetails.genre_ids ||
            [];

          const genres = await Genre.find({ id: { $in: genreIds } });
          const missingGenres = genreIds.filter(
            (id) => !genres.some((g) => g.id === id)
          );
          if (missingGenres.length > 0) {
            console.warn(
              `Movie ${movie.id} has unknown genre IDs:`,
              missingGenres
            );
          }

          const { genre_ids, genres: _, ...cleanMovie } = movieDetails;
          const backdrop_path = ensureImageUrl(cleanMovie.backdrop_path);
          const poster_path = ensureImageUrl(cleanMovie.poster_path);

          return {
            updateOne: {
              filter: { id: movieDetails.id },
              update: {
                $set: {
                  ...cleanMovie,
                  backdrop_path,
                  poster_path,
                  genre_ids: genres.map((g) => g._id),
                  media_type: "movie",
                },
              },
              upsert: true,
            },
          };
        } catch (error) {
          console.error(`Error processing movie ${movie.id}:`, error);
          return null;
        }
      })
    );

    const validMovieOps = movieOperations.filter(
      Boolean
    ) as mongoose.AnyBulkWriteOperation[];
    await processInBatches(validMovieOps, Movie, "movies");
    console.log(`Processed ${validMovieOps.length} movies`);

    // Seed TV Shows
    const popularTVShows = await tvService.getPopularTvShows();
    console.log(`Processing ${popularTVShows.results.length} TV shows...`);

    const tvOperations = await Promise.all(
      popularTVShows.results.map(async (tvShow) => {
        try {
          const tvDetails = (await tvService.getTvShowDetails(
            tvShow.id
          )) as ITMDBTVShow;
          const genreIds =
            tvDetails.genres?.map((g) => g.id) || tvDetails.genre_ids || [];

          const genres = await Genre.find({ id: { $in: genreIds } });
          const missingGenres = genreIds.filter(
            (id) => !genres.some((g) => g.id === id)
          );
          if (missingGenres.length > 0) {
            console.warn(
              `TV Show ${tvShow.id} has unknown genre IDs:`,
              missingGenres
            );
          }

          const { genre_ids, genres: _, ...cleanTV } = tvDetails;
          const backdrop_path = ensureImageUrl(cleanTV.backdrop_path);
          const poster_path = ensureImageUrl(cleanTV.poster_path);

          return {
            updateOne: {
              filter: { id: tvDetails.id },
              update: {
                $set: {
                  ...cleanTV,
                  backdrop_path,
                  poster_path,
                  genre_ids: genres.map((g) => g._id),
                  media_type: "tv",
                },
              },
              upsert: true,
            },
          };
        } catch (error) {
          console.error(`Error processing TV show ${tvShow.id}:`, error);
          return null;
        }
      })
    );

    const validTVOps = tvOperations.filter(
      Boolean
    ) as mongoose.AnyBulkWriteOperation[];
    await processInBatches(validTVOps, TVShow, "TV shows");
    console.log(`Processed ${validTVOps.length} TV shows`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};
