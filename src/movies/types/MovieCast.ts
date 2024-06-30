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

interface Reviews {
  reviews: any; // replace 'any' with the actual type
}

interface SimilarMovies {
  similarMovies: any; // replace 'any' with the actual type
}

interface Videos {
  videos: any; // replace 'any' with the actual type
}

interface Images {
  images: any; // replace 'any' with the actual type
}

export interface PopularMovies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

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

export interface Options<T extends AppendOptions[]> {
  include?: T;
}

type AppendResponseMap = {
  credits: MoveiCreditsResponseBody;
  reviews: Reviews;
  similar: SimilarMovies;
  videos: Videos;
  images: Images;
};

export type AppendResponse<T extends AppendOptions[]> = {
  [K in T[number]]: AppendResponseMap[K];
};

export type AppendOptions = 'credits' | 'reviews' | 'similar' | 'videos' | 'images';
