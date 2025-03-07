export interface MovieDetailsInterface {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
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
}
