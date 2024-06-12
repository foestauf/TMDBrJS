import { Person } from '../../people/types/Person';

export interface CastMember extends Person {
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewMember extends Person {
  credit_id: string;
  department: string;
  job: string;
}

export interface MoveiCreditsResponseBody {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MovieOptions<T extends MovieIncludeOptions[]> {
  include?: MovieIncludeOptions[];
}

export type MovieIncludeOptions = [
  | 'credits'
  | 'images'
  | 'videos'
  | 'similar'
  | 'reviews'
  | 'lists'
  | 'recommendations'
  | 'release_dates'
  | 'keywords'
  | 'changes'
  | 'translations'
  | 'external_ids'
  | 'watch/providers',
];

interface Reviews {
  reviews: any; // replace 'any' with the actual type
}

interface SimilarMovies {
  similarMovies: any; // replace 'any' with the actual type
}

interface Credits {
  credits: any; // replace 'any' with the actual type
}

interface Videos {
  videos: any; // replace 'any' with the actual type
}

interface Images {
  images: any; // replace 'any' with the actual type
}

export interface Popular {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

type IncludeOptionsMap = {
  reviews: Reviews;
  similarMovies: SimilarMovies;
  credits: Credits;
  videos: Videos;
  images: Images;
};

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type MovieAppendResponse<T extends MovieIncludeOptions[]> = T extends (infer U)[]
  ? U extends keyof IncludeOptionsMap
    ? IncludeOptionsMap[U]
    : never
  : never;
