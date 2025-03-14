import { Request, Response } from "express";
import { tvService } from "../services/tmdbService";
import { tvShowService } from "../services/tvShowService";
import { ITVShow } from "../interfaces/tvShow.interface";

const tvShowController = {
  // Fetch popular TV shows from TMDB
  getPopularTvShows: async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const data = await tvService.getPopularTvShows(Number(page));
    res.json(data);
  },

  // Add a TV show to the database
  addTVShow: async (req: Request, res: Response) => {
    const tvShowData: ITVShow = req.body;
    const tvShow = await tvShowService.addTVShow(tvShowData);
    res.status(201).json(tvShow);
  },

  // Update a TV show in the database
  updateTVShow: async (req: Request, res: Response) => {
    const { id } = req.params;
    const tvShowData: Partial<ITVShow> = req.body;
    const tvShow = await tvShowService.updateTVShow(id, tvShowData);
    res.json(tvShow);
  },

  // Delete a TV show from the database
  deleteTVShow: async (req: Request, res: Response) => {
    const { id } = req.params;
    await tvShowService.deleteTVShow(id);
    res.status(204).send();
  },

  // Fetch all TV shows from the database
  getAllTVShows: async (req: Request, res: Response) => {
    const tvShows = await tvShowService.getAllTVShows();
    res.json(tvShows);
  },

  // Fetch a TV show by ID from the database
  getTVShowById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const tvShow = await tvShowService.getTVShowById(id);
    res.json(tvShow);
  },
};

export default tvShowController;
