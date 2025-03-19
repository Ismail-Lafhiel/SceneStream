import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { movieService } from "../services/movieService";
import {
  processImageUploads,
  uploadMovieImages,
} from "../middlewares/fileUpload";

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const movies = await movieService.getAllMovies(Number(page), Number(limit));
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(Number(id));
    if (!movie) {
      throw new AppError(404, "Movie not found");
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

// Add a movie to the database
export const addMovie = [
  uploadMovieImages,
  processImageUploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movieData = req.body;

      // Convert genre_ids to an array of numbers
      if (Array.isArray(movieData.genre_ids)) {
        movieData.genre_ids = movieData.genre_ids.map(Number);
      } else {
        movieData.genre_ids = [];
      }

      const movie = await movieService.addMovie(movieData);
      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  },
];

export const updateMovie = [
  uploadMovieImages,
  processImageUploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const movieData = req.body;
      const updatedMovie = await movieService.updateMovie(
        Number(id),
        movieData
      );
      if (!updatedMovie) {
        throw new AppError(404, "Movie not found");
      }
      res.json(updatedMovie);
    } catch (error) {
      next(error);
    }
  },
];

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await movieService.deleteMovie(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
