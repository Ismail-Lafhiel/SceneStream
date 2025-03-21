import { ITVShow } from "./tvShow.interface";
import { IVideo } from "./video.interface";

// @ts-ignore
export interface TVShowDetails extends ITVShow {
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
  videos?: {
    results: IVideo[];
  };
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  in_production: boolean;
  last_air_date: string;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string;
  }>;
}
