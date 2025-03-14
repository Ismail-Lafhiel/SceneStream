import Genre from "../models/genre.model";
import { IGenre } from "../interfaces/genre.interface";

export const genreService = {
  // Add a genre to the database
  addGenre: async (genreData: IGenre) => {
    const genre = new Genre(genreData);
    await genre.save();
    return genre;
  },

  // Fetch all genres from the database
  getAllGenres: async () => {
    const genres = await Genre.find();
    return genres;
  },
};
