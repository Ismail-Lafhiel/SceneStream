import { Request, Response } from "express";
import { genreService } from "../services/genreService";
import { AppError } from "../utils/errors";

export const getGenres = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const genres = await genreService.getAllGenres(Number(page), Number(limit));
    res.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
};

export const getGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const genre = await genreService.getGenre(Number(id));
    if (!genre) {
      throw new AppError(404, "Genre not found");
    }
    res.json(genre);
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).json({ error: "Failed to fetch genre" });
  }
};

export const addGenre = async (req: Request, res: Response) => {
  const genreData = req.body;
  try {
    const genre = await genreService.addGenre(genreData);
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ message: "Failed to create genre", error });
  }
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
