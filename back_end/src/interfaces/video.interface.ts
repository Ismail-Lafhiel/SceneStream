export interface IVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size?: number;
  official?: boolean;
  published_at?: string;
}
