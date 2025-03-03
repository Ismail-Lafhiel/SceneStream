export interface ICredit {
  cast: ICast[];
  crew: ICrew[];
}
export interface ICast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface ICrew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}