// src/services/tmdbService.js
const axios = require('axios');
const Movie = require('../models/movie');
const TvShow = require('../models/tvshow');
const Genre = require('../models/Genre');
const config = require('../config/config');

class TMDBService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: config.api_key
      }
    });
  }

  async fetchMovieDetails(tmdbId) {
    try {
      const response = await this.api.get(`/movie/${tmdbId}`, {
        params: {
          append_to_response: 'credits,videos,images'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error.message);
      return null;
    }
  }

  async fetchTvShowDetails(tmdbId) {
    try {
      const response = await this.api.get(`/tv/${tmdbId}`, {
        params: {
          append_to_response: 'credits,videos,images'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error.message);
      return null;
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await this.api.get('/search/movie', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error.message);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  }

  async searchTvShows(query, page = 1) {
    try {
      const response = await this.api.get('/search/tv', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error.message);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await this.api.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error.message);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  }

  async getPopularTvShows(page = 1) {
    try {
      const response = await this.api.get('/tv/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error.message);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  }

  async getMovieGenres() {
    try {
      const response = await this.api.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching movie genres:', error.message);
      return [];
    }
  }

  async getTvGenres() {
    try {
      const response = await this.api.get('/genre/tv/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching TV genres:', error.message);
      return [];
    }
  }

  // This method will sync all genres from TMDB to our database
  async syncGenres() {
    try {
      const movieGenres = await this.getMovieGenres();
      const tvGenres = await this.getTvGenres();
      
      // Combine and deduplicate genres by ID
      const allGenres = [...movieGenres];
      for (const tvGenre of tvGenres) {
        if (!allGenres.some(g => g.id === tvGenre.id)) {
          allGenres.push(tvGenre);
        }
      }
      
      // Upsert all genres to our database
      for (const genre of allGenres) {
        await Genre.findOneAndUpdate(
          { tmdbId: genre.id },
          { 
            tmdbId: genre.id,
            name: genre.name
          },
          { upsert: true, new: true }
        );
      }
      
      return allGenres.length;
    } catch (error) {
      console.error('Error syncing genres:', error.message);
      throw error;
    }
  }

  // Maps TMDB movie object to our database schema
  mapMovieData(tmdbMovie, existingMovie = null) {
    const baseUrl = 'https://image.tmdb.org/t/p/';
    
    return {
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      tmdbId: tmdbMovie.id,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path ? `${baseUrl}w500${tmdbMovie.poster_path}` : null,
      backdropPath: tmdbMovie.backdrop_path ? `${baseUrl}original${tmdbMovie.backdrop_path}` : null,
      releaseDate: tmdbMovie.release_date,
      runtime: tmdbMovie.runtime,
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      genres: tmdbMovie.genres?.map(g => g.id) || tmdbMovie.genre_ids,
      status: existingMovie?.status || 'active',
      isCustom: existingMovie?.isCustom || false
    };
  }

  // Maps TMDB tv show object to our database schema
  mapTvShowData(tmdbTvShow, existingTvShow = null) {
    const baseUrl = 'https://image.tmdb.org/t/p/';
    
    return {
      name: tmdbTvShow.name,
      originalName: tmdbTvShow.original_name,
      tmdbId: tmdbTvShow.id,
      overview: tmdbTvShow.overview,
      posterPath: tmdbTvShow.poster_path ? `${baseUrl}w500${tmdbTvShow.poster_path}` : null,
      backdropPath: tmdbTvShow.backdrop_path ? `${baseUrl}original${tmdbTvShow.backdrop_path}` : null,
      firstAirDate: tmdbTvShow.first_air_date,
      lastAirDate: tmdbTvShow.last_air_date,
      numberOfSeasons: tmdbTvShow.number_of_seasons,
      numberOfEpisodes: tmdbTvShow.number_of_episodes,
      episodeRunTime: tmdbTvShow.episode_run_time,
      voteAverage: tmdbTvShow.vote_average,
      voteCount: tmdbTvShow.vote_count,
      popularity: tmdbTvShow.popularity,
      genres: tmdbTvShow.genres?.map(g => g.id) || tmdbTvShow.genre_ids,
      status: existingTvShow?.status || 'active',
      isCustom: existingTvShow?.isCustom || false
    };
  }

  // Import a movie from TMDB to our database
  async importMovie(tmdbId) {
    try {
      // Check if movie already exists in our database
      let movie = await Movie.findOne({ tmdbId });
      
      // If movie exists but is marked as deleted, reactivate it
      if (movie && movie.status === 'deleted') {
        movie.status = 'active';
        await movie.save();
        return movie;
      }
      
      // If movie doesn't exist, fetch from TMDB and create it
      if (!movie) {
        const tmdbMovie = await this.fetchMovieDetails(tmdbId);
        if (!tmdbMovie) {
          throw new Error(`Movie with TMDB ID ${tmdbId} not found`);
        }
        
        const movieData = this.mapMovieData(tmdbMovie);
        movie = await Movie.create(movieData);
      }
      
      return movie;
    } catch (error) {
      console.error(`Error importing movie ${tmdbId}:`, error.message);
      throw error;
    }
  }

  // Import a TV show from TMDB to our database
  async importTvShow(tmdbId) {
    try {
      // Check if TV show already exists in our database
      let tvShow = await TvShow.findOne({ tmdbId });
      
      // If TV show exists but is marked as deleted, reactivate it
      if (tvShow && tvShow.status === 'deleted') {
        tvShow.status = 'active';
        await tvShow.save();
        return tvShow;
      }
      
      // If TV show doesn't exist, fetch from TMDB and create it
      if (!tvShow) {
        const tmdbTvShow = await this.fetchTvShowDetails(tmdbId);
        if (!tmdbTvShow) {
          throw new Error(`TV show with TMDB ID ${tmdbId} not found`);
        }
        
        const tvShowData = this.mapTvShowData(tmdbTvShow);
        tvShow = await TvShow.create(tvShowData);
      }
      
      return tvShow;
    } catch (error) {
      console.error(`Error importing TV show ${tmdbId}:`, error.message);
      throw error;
    }
  }

  // Update a movie in our database with latest data from TMDB
  async updateMovieFromTmdb(tmdbId) {
    try {
      // Check if movie exists in our database
      let movie = await Movie.findOne({ tmdbId });
      
      if (!movie) {
        throw new Error(`Movie with TMDB ID ${tmdbId} not found in our database`);
      }
      
      // If it's a custom movie (not from TMDB), don't update from TMDB
      if (movie.isCustom) {
        return movie;
      }
      
      // Fetch latest data from TMDB
      const tmdbMovie = await this.fetchMovieDetails(tmdbId);
      if (!tmdbMovie) {
        throw new Error(`Movie with TMDB ID ${tmdbId} not found on TMDB`);
      }
      
      // Update movie with latest TMDB data while preserving our custom fields
      const movieData = this.mapMovieData(tmdbMovie, movie);
      Object.assign(movie, movieData);
      await movie.save();
      
      return movie;
    } catch (error) {
      console.error(`Error updating movie ${tmdbId} from TMDB:`, error.message);
      throw error;
    }
  }

  // Update a TV show in our database with latest data from TMDB
  async updateTvShowFromTmdb(tmdbId) {
    try {
      // Check if TV show exists in our database
      let tvShow = await TvShow.findOne({ tmdbId });
      
      if (!tvShow) {
        throw new Error(`TV show with TMDB ID ${tmdbId} not found in our database`);
      }
      
      // If it's a custom TV show (not from TMDB), don't update from TMDB
      if (tvShow.isCustom) {
        return tvShow;
      }
      
      // Fetch latest data from TMDB
      const tmdbTvShow = await this.fetchTvShowDetails(tmdbId);
      if (!tmdbTvShow) {
        throw new Error(`TV show with TMDB ID ${tmdbId} not found on TMDB`);
      }
      
      // Update TV show with latest TMDB data while preserving our custom fields
      const tvShowData = this.mapTvShowData(tmdbTvShow, tvShow);
      Object.assign(tvShow, tvShowData);
      await tvShow.save();
      
      return tvShow;
    } catch (error) {
      console.error(`Error updating TV show ${tmdbId} from TMDB:`, error.message);
      throw error;
    }
  }
}

module.exports = new TMDBService();