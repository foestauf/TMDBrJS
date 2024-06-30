import { CastMember, CrewMember } from '../../movies/types/MovieCast';

export interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

type MovieCredits = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export interface PopularPeople {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

interface TvCredits {
  tvCredits: any; // replace 'any' with the actual type
}

interface CombinedCredits {
  combinedCredits: any; // replace 'any' with the actual type
}

interface Images {
  images: any; // replace 'any' with the actual type
}

type Latest = {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string | null;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
};

export interface Options<T extends AppendOptions[]> {
  include?: T;
}

type AppendResponseMap = {
  movieCredits: MovieCredits;
  tvCredits: TvCredits;
  combinedCredits: CombinedCredits;
  images: Images;
  latest: Latest;
};

export type AppendResponse<T extends AppendOptions[]> = {
  [K in T[number]]: AppendResponseMap[K];
};

export type AppendOptions = 'movieCredits' | 'tvCredits' | 'combinedCredits' | 'images' | 'latest';
