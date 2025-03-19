import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { tvService } from "../services/tvShowService";
import {
  processImageUploads,
  uploadMovieImages,
} from "../middlewares/fileUpload";

export const getTVShows = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tvShows = await tvService.getAllTVShows(Number(page), Number(limit));
    res.json(tvShows);
  } catch (error) {
    next(error);
  }
};

export const getTVShowById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tvShow = await tvService.getTVShowById(Number(id));
    if (!tvShow) {
      throw new AppError(404, "TV show not found");
    }
    res.json(tvShow);
  } catch (error) {
    next(error);
  }
};

export const addTVShow = [
  uploadMovieImages,
  processImageUploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tvShowData = req.body;

      // Convert genre_ids to an array of numbers
      if (Array.isArray(tvShowData.genre_ids)) {
        tvShowData.genre_ids = tvShowData.genre_ids.map(Number);
      } else {
        tvShowData.genre_ids = [];
      }

      // console.log("Received TV show data:", tvShowData);
      const tvShow = await tvService.addTVShow(tvShowData);
      res.status(201).json(tvShow);
    } catch (error) {
      next(error);
    }
  },
];

export const updateTVShow = [
  uploadMovieImages,
  processImageUploads,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tvShowData = req.body;
      const updatedTVShow = await tvService.updateTVShow(Number(id), tvShowData);
      if (!updatedTVShow) {
        throw new AppError(404, "TV show not found");
      }
      res.json(updatedTVShow);
    } catch (error) {
      console.error("Error updating TV show:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const deleteTVShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await tvService.deleteTVShow(Number(id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting TV show:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
