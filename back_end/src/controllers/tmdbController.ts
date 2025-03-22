import { Request, Response, NextFunction } from "express";
import { movieService, tvService, genreService } from "../services/tmdbService";

export const tmdbController = {
  // Movie-related endpoints
  async getPopularMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getPopularMovies(page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getTrendingMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const timeWindow = (req.query.timeWindow as "day" | "week") || "week";
      const movies = await movieService.getTrendingMovies(timeWindow);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getMoviesByGenre(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const genreId = parseInt(req.params.genreId);
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getMoviesByGenre(genreId, page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getMovieDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId);
      const movie = await movieService.getMovieDetails(movieId);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  },

  async getSimilarMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId);
      const movies = await movieService.getSimilarMovies(movieId);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getTopRatedMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getTopRatedMovies(page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getNowPlayingMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getNowPlayingMovies(page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getUpcomingMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getUpcomingMovies(page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getNewReleases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getNewReleases(page);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  async getMovieVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId);
      const videos = await movieService.getMovieVideos(movieId);
      res.json(videos);
    } catch (error) {
      next(error);
    }
  },

  async discoverMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const with_genres = req.query.with_genres ? parseInt(req.query.with_genres as string) : null;
      const sort_by = req.query.sort_by as string || "popularity.desc";
      const search = req.query.search as string;

      const params = {
        page,
        with_genres,
        sort_by,
        search
      };

      const movies = await movieService.discoverMovies(params);
      res.json(movies);
    } catch (error) {
      next(error);
    }
  },

  // TV Show-related endpoints
  async getPopularTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const tvShows = await tvService.getPopularTvShows(page);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  async getTopRatedTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const tvShows = await tvService.getTopRatedTvShows(page);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  async getOnAirTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const tvShows = await tvService.getOnAirTvShows(page);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  async getUpcomingTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const tvShows = await tvService.getUpcomingTvShows(page);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  async getTvShowDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tvId = parseInt(req.params.tvId);
      const tvShow = await tvService.getTvShowDetails(tvId);
      res.json(tvShow);
    } catch (error) {
      next(error);
    }
  },

  async getSimilarTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tvId = parseInt(req.params.tvId);
      const tvShows = await tvService.getSimilarTvShows(tvId);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  async getTvShowVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tvId = parseInt(req.params.tvId);
      const videos = await tvService.getTvShowVideos(tvId);
      res.json(videos);
    } catch (error) {
      next(error);
    }
  },

  async discoverTvShows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const with_genres = req.query.with_genres ? parseInt(req.query.with_genres as string) : null;
      const sort_by = req.query.sort_by as string || "popularity.desc";
      const search = req.query.search as string;

      const params = {
        page,
        with_genres,
        sort_by,
        search
      };

      const tvShows = await tvService.discoverTvShows(params);
      res.json(tvShows);
    } catch (error) {
      next(error);
    }
  },

  // Genre-related endpoints
  async getMovieGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const genres = await genreService.getMovieGenres();
      res.json(genres);
    } catch (error) {
      next(error);
    }
  },

  async getTvGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const genres = await genreService.getTvGenres();
      res.json(genres);
    } catch (error) {
      next(error);
    }
  },
};