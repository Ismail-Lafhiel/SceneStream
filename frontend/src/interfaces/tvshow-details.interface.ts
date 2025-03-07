export interface TvShowDetailsInterface {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
  };
  episode_run_time: number[];
  seasons: {
    id: number;
    name: string;
    overview: string;
    season_number: number;
    episode_count: number;
    poster_path: string;
    air_date: string;
  }[];
}
