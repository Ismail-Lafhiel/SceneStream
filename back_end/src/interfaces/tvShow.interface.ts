import { Types } from "mongoose";
import { IVideo } from "./video.interface";

export interface ITVShow {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: Types.ObjectId[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string;
    }[];
  };
  videos?: {
    results: IVideo[];
  };
}
