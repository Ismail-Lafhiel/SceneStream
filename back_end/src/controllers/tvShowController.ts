import { Request, Response } from "express";
import { AppError } from "../utils/errors";
import { tvService } from "../services/tvShowService";

export const getTVShows = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const tvShows = await tvService.getAllTVShows(Number(page), Number(limit));
  res.json(tvShows);
};

export const getTVShowById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tvShow = await tvService.getTVShowById(Number(id));
  if (!tvShow) {
    throw new AppError(404, "TV show not found");
  }
  res.json(tvShow);
};

export const addTVShow = async (req: Request, res: Response) => {
  const tvShowData = req.body;
  const tvShow = await tvService.addTVShow(tvShowData);
  res.status(201).json(tvShow);
};

export const updateTVShow = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tvShowData = req.body;
  const updatedTVShow = await tvService.updateTVShow(Number(id), tvShowData);
  if (!updatedTVShow) {
    throw new AppError(404, "TV show not found");
  }
  res.json(updatedTVShow);
};

export const deleteTVShow = async (req: Request, res: Response) => {
  const { id } = req.params;
  await tvService.deleteTVShow(Number(id));
  res.status(204).send();
};
