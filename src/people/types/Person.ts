import { CastMember, CrewMember } from '../../movies/types/MovieCast';

export interface Person {
  adult: boolean;
  alsoKnownAs: string[];
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  id: number;
  imdbId: string;
  knownForDepartment: string;
  name: string;
  placeOfBirth: string;
  popularity: number;
  profilePath: string;
}

type MovieCredits = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export interface PopularPeople {
  page: number;
  results: Person[];
  totalPages: number;
  totalResults: number;
}

interface TvCredits {
  tvCredits: unknown; // replace 'unknown' with the actual type
}

interface CombinedCredits {
  combinedCredits: unknown; // replace 'unknown' with the actual type
}

interface Images {
  images: unknown; // replace 'unknown' with the actual type
}

type Latest = {
  adult: boolean;
  alsoKnownAs: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdbId: string | null;
  knownForDepartment: string | null;
  name: string;
  placeOfBirth: string | null;
  popularity: number;
  profilePath: string | null;
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
