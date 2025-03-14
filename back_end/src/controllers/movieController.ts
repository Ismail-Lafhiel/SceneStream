import { Request, Response } from "express";
import { movieService } from "../services/tmdbService";
import { movieService as dbMovieService } from "../services/movieService";
import { IMovie } from "../interfaces/movie.interface";

const movieController = {
  // Fetch popular movies from TMDB
  getPopularMovies: async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const data = await movieService.getPopularMovies(Number(page));
    res.json(data);
  },

  // Add a movie to the database
  addMovie: async (req: Request, res: Response) => {
    const movieData: IMovie = req.body;
    const movie = await dbMovieService.addMovie(movieData);
    res.status(201).json(movie);
  },

  // Update a movie in the database
  updateMovie: async (req: Request, res: Response) => {
    const { id } = req.params;
    const movieData: Partial<IMovie> = req.body;
    const movie = await dbMovieService.updateMovie(id, movieData);
    res.json(movie);
  },

  // Delete a movie from the database
  deleteMovie: async (req: Request, res: Response) => {
    const { id } = req.params;
    await dbMovieService.deleteMovie(id);
    res.status(204).send();
  },

  // Fetch all movies from the database
  getAllMovies: async (req: Request, res: Response) => {
    const movies = await dbMovieService.getAllMovies();
    res.json(movies);
  },

  // Fetch a movie by ID from the database
  getMovieById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await dbMovieService.getMovieById(id);
    res.json(movie);
  },
};

export default movieController;
