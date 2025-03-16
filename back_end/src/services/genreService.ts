import Genre from "../models/genre.model";
import { IGenre } from "../interfaces/genre.interface";
import { IPaginatedResponse } from "../interfaces";

export const genreService = {
  // Fetch all genres from the database
  getAllGenres: async (
    page = 1,
    limit = 10
  ): Promise<IPaginatedResponse<IGenre>> => {
    const skip = (page - 1) * limit;
    const genres = await Genre.find().skip(skip).limit(limit);
    const total = await Genre.countDocuments();

    return {
      page,
      results: genres,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    };
  },

  addGenre: async (genreData: IGenre) => {
    // Generate a unique ID (e.g., using a counter or UUID)
    const lastGenre = await Genre.findOne().sort({ id: -1 }); // Get the last genre
    const newId = lastGenre ? lastGenre.id + 1 : 1; // Increment the ID

    const genre = new Genre({
      id: newId, // Automatically assign the new ID
      name: genreData.name,
    });

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
