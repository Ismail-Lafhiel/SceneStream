import Genre from "../models/genre.model";
import { IGenre } from "../interfaces/genre.interface";

export const genreService = {
  // Fetch all genres from the database
  getAllGenres: async (): Promise<IGenre[]> => {
    const genres = await Genre.find();
    return genres;
  },

  addGenre: async (genreData: IGenre) => {
    const genre = new Genre(genreData);
    await genre.save();
    return genre;
  },

  // Update a genre in the database
  updateGenre: async (
    id: number,
    genreData: Partial<IGenre>
  ): Promise<IGenre | null> => {
    const genre = await Genre.findOneAndUpdate({ id }, genreData, {
      new: true,
    });
    return genre;
  },

  // Delete a genre from the database
  deleteGenre: async (id: number): Promise<void> => {
    await Genre.findOneAndDelete({ id });
  },
};
