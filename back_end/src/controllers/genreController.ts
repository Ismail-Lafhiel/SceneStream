import { Request, Response } from "express";
import { genreService } from "../services/tmdbService";
import { genreService as dbGenreService } from "../services/genreService";
import { IGenre } from "../interfaces/genre.interface";

const genreController = {
  // Fetch movie genres from TMDB
  getMovieGenres: async (req: Request, res: Response) => {
    const genres = await genreService.getMovieGenres();
    res.json(genres);
  },

  // Fetch TV show genres from TMDB
  getTvGenres: async (req: Request, res: Response) => {
    const genres = await genreService.getTvGenres();
    res.json(genres);
  },

  // Add a genre to the database
  addGenre: async (req: Request, res: Response) => {
    const genreData: IGenre = req.body;
    const genre = await dbGenreService.addGenre(genreData);
    res.status(201).json(genre);
  },

  // Fetch all genres from the database
  getAllGenres: async (req: Request, res: Response) => {
    const genres = await dbGenreService.getAllGenres();
    res.json(genres);
  },
};

export default genreController;
