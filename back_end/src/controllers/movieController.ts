import { Request, Response } from "express";
import { AppError } from "../utils/errors";
import { movieService } from "../services/movieService";

export const getMovies = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const movies = await movieService.getAllMovies(Number(page), Number(limit));
  res.json(movies);
};

export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await movieService.getMovieById(Number(id));
  if (!movie) {
    throw new AppError(404, "Movie not found");
  }
  res.json(movie);
};

// Add a movie to the database
export const addMovie = async (req: Request, res: Response) => {
  const movieData = req.body;
  const movie = await movieService.addMovie(movieData);
  res.status(201).json(movie);
};

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieData = req.body;
  const updatedMovie = await movieService.updateMovie(Number(id), movieData);
  if (!updatedMovie) {
    throw new AppError(404, "Movie not found");
  }
  res.json(updatedMovie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  await movieService.deleteMovie(Number(id));
  res.status(204).send();
};