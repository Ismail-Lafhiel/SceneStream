import express from "express";
import { tmdbController } from "../controllers/tmdbController";

const router = express.Router();

// Movie routes
router.get("/movies/popular", tmdbController.getPopularMovies);
router.get("/movies/trending", tmdbController.getTrendingMovies);
router.get("/movies/top-rated", tmdbController.getTopRatedMovies);
router.get("/movies/now-playing", tmdbController.getNowPlayingMovies);
router.get("/movies/upcoming", tmdbController.getUpcomingMovies);
router.get("/movies/new-releases", tmdbController.getNewReleases);
router.get("/movies/genre/:genreId", tmdbController.getMoviesByGenre);
router.get("/movies/discover", tmdbController.discoverMovies);
router.get("/movies/:movieId", tmdbController.getMovieDetails);
router.get("/movies/:movieId/similar", tmdbController.getSimilarMovies);
router.get("/movies/:movieId/videos", tmdbController.getMovieVideos);

// TV Show routes
router.get("/tv/popular", tmdbController.getPopularTvShows);
router.get("/tv/top-rated", tmdbController.getTopRatedTvShows);
router.get("/tv/on-air", tmdbController.getOnAirTvShows);
router.get("/tv/airing-today", tmdbController.getUpcomingTvShows);
router.get("/tv/discover", tmdbController.discoverTvShows);
router.get("/tv/:tvId", tmdbController.getTvShowDetails);
router.get("/tv/:tvId/similar", tmdbController.getSimilarTvShows);
router.get("/tv/:tvId/videos", tmdbController.getTvShowVideos);

// Genre routes
router.get("/genres/movies", tmdbController.getMovieGenres);
router.get("/genres/tv", tmdbController.getTvGenres);

export default router;