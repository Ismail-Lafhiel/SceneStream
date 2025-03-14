import Movie from "../models/movie.model";
import { IMovie } from "../interfaces/movie.interface";

export const movieService = {
  // Add a movie to the database
  addMovie: async (movieData: IMovie) => {
    const movie = new Movie(movieData);
    await movie.save();
    return movie;
  },

  // Update a movie in the database
  updateMovie: async (id: string, movieData: Partial<IMovie>) => {
    const movie = await Movie.findByIdAndUpdate(id, movieData, { new: true });
    return movie;
  },

  // Delete a movie from the database
  deleteMovie: async (id: string) => {
    await Movie.findByIdAndDelete(id);
  },

  // Fetch all movies from the database
  getAllMovies: async () => {
    const movies = await Movie.find();
    return movies;
  },

  // Fetch a movie by ID from the database
  getMovieById: async (id: string) => {
    const movie = await Movie.findById(id);
    return movie;
  },
};
