import { IMovie } from "./movie.interface";

export interface MovieSection {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
  movies: IMovie[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  fetchMovies: (page: number) => Promise<void>;
}