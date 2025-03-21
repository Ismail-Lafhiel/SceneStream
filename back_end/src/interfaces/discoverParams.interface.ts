export interface DiscoverParams {
  page?: number;
  with_genres?: number | null;
  sort_by?: string;
  search?: string;
  query?: string;
  [key: string]: any;
}