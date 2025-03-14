import { tvService } from '../services/tmdbService';
import TVShow from '../models/tvShow.model';
import { ITVShow } from '../interfaces/tvShow.interface';

export const syncTVShows = async () => {
  try {
    // Fetch popular TV shows from TMDB API
    const popularTVShows = await tvService.getPopularTvShows();

    // Loop through the TV shows and sync them to MongoDB
    for (const tvShowData of popularTVShows.results) {
      // Transform TMDB TV show data to match your MongoDB schema
      const tvShow: ITVShow = {
        id: tvShowData.id,
        name: tvShowData.name,
        overview: tvShowData.overview,
        backdrop_path: tvShowData.backdrop_path,
        poster_path: tvShowData.poster_path,
        first_air_date: tvShowData.first_air_date,
        vote_average: tvShowData.vote_average,
        vote_count: tvShowData.vote_count,
        genre_ids: tvShowData.genre_ids,
      };

      // Upsert the TV show (update if exists, insert if not)
      await TVShow.findOneAndUpdate({ id: tvShow.id }, tvShow, { upsert: true });
    //   console.log(`Synced TV show: ${tvShow.name}`);
    }

    console.log('TV show sync completed successfully.');
  } catch (error) {
    console.error('Error syncing TV shows:', error);
  }
};