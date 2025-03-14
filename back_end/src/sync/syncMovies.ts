import { movieService } from "../services/tmdbService";
import Movie from "../models/movie.model";
import { IMovie } from "../interfaces/movie.interface";

export const syncMovies = async () => {
  try {
    // Fetch popular movies from TMDB API
    const popularMovies = await movieService.getPopularMovies();

    // Loop through the movies and sync them to MongoDB
    for (const movieData of popularMovies.results) {
      // Transform TMDB movie data to match your MongoDB schema
      const movie: IMovie = {
        id: movieData.id,
        title: movieData.title,
        overview: movieData.overview,
        backdrop_path: movieData.backdrop_path,
        poster_path: movieData.poster_path,
        release_date: movieData.release_date,
        vote_average: movieData.vote_average,
        vote_count: movieData.vote_count,
        genre_ids: movieData.genre_ids,
      };

      // Upsert the movie (update if exists, insert if not)
      await Movie.findOneAndUpdate({ id: movie.id }, movie, { upsert: true });
    //   console.log(`Synced movie: ${movie.title}`);
    }

    console.log("Movie sync completed successfully.");
  } catch (error) {
    console.error("Error syncing movies:", error);
  }
};
