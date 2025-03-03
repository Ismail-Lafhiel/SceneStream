export type MediaType = "movie" | "tv" | "all";
export type SortBy = "popularity" | "rating" | "release_date" | "title";

export interface FilterOption {
  value: string;
  label: string;
  icon?: JSX.Element;
}

export interface DiscoverParams {
  page?: number;
  with_genres?: number | null;
  sort_by?: string;
  search?: string;
}
