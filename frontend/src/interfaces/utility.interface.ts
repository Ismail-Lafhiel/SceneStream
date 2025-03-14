import { IGenre } from "@/interfaces/genre.interface";
import { IMovie } from "@/interfaces/movie.interface";
import { ITVShow } from "@/interfaces/tv.interface";

export type MovieDetails = Omit<IMovie, "genre_ids"> & {
  genres: IGenre[];
  runtime: number;
  status: string;
  tagline: string;
};

export type TVShowDetails = Omit<ITVShow, "genre_ids"> & {
  genres: IGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
};
  