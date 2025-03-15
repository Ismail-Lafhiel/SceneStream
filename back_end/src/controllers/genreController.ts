import { Request, Response } from "express";
import { genreService } from "../services/genreService";
import { AppError } from "../utils/errors";

export const getGenres = async (req: Request, res: Response) => {
  const genres = await genreService.getAllGenres();
  res.json(genres);
};

export const addGenre = async (req: Request, res: Response) => {
  const genreData = req.body;
  const genre = await genreService.addGenre(genreData);
  res.status(201).json(genre);
};

export const updateGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  const genreData = req.body;
  const updatedGenre = await genreService.updateGenre(Number(id), genreData);
  if (!updatedGenre) {
    throw new AppError(404, "Genre not found");
  }
  res.json(updatedGenre);
};

export const deleteGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  await genreService.deleteGenre(Number(id));
  res.status(204).send();
};
