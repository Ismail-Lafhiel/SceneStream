export interface IMovieBookmark extends Document {
  userId: string;
  movieId: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  runtime?: number;
  release_date?: string;
  overview?: string;
}

export interface ITvShowBookmark extends Document {
  userId: string;
  tvShowId: number;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  overview?: string;
}
