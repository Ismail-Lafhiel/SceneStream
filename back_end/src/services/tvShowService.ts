import TVShow from "../models/tvShow.model";
import { ITVShow } from "../interfaces/tvShow.interface";

export const tvShowService = {
  // Add a TV show to the database
  addTVShow: async (tvShowData: ITVShow) => {
    const tvShow = new TVShow(tvShowData);
    await tvShow.save();
    return tvShow;
  },

  // Update a TV show in the database
  updateTVShow: async (id: string, tvShowData: Partial<ITVShow>) => {
    const tvShow = await TVShow.findByIdAndUpdate(id, tvShowData, {
      new: true,
    });
    return tvShow;
  },

  // Delete a TV show from the database
  deleteTVShow: async (id: string) => {
    await TVShow.findByIdAndDelete(id);
  },

  // Fetch all TV shows from the database
  getAllTVShows: async () => {
    const tvShows = await TVShow.find();
    return tvShows;
  },

  // Fetch a TV show by ID from the database
  getTVShowById: async (id: string) => {
    const tvShow = await TVShow.findById(id);
    return tvShow;
  },
};
