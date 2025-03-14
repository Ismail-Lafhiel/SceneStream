import { genreService } from "../services/tmdbService";
import Genre from "../models/genre.model";
import { IGenre } from "../interfaces/genre.interface";

export const syncGenres = async () => {
  try {
    // Fetch movie genres from TMDB API
    const movieGenres = await genreService.getMovieGenres();

    // Fetch TV show genres from TMDB API
    const tvGenres = await genreService.getTvGenres();

    // Combine movie and TV show genres
    const allGenres = [...movieGenres, ...tvGenres];

    // Loop through the genres and sync them to MongoDB
    for (const genreData of allGenres) {
      // Transform TMDB genre data to match your MongoDB schema
      const genre: IGenre = {
        id: genreData.id,
        name: genreData.name,
      };

      // Upsert the genre (update if exists, insert if not)
      await Genre.findOneAndUpdate({ id: genre.id }, genre, { upsert: true });
    //   console.log(`Synced genre: ${genre.name}`);
    }

    console.log("Genre sync completed successfully.");
  } catch (error) {
    console.error("Error syncing genres:", error);
  }
};
