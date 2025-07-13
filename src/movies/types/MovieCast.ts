import { Person } from '../../people/types/Person';

export interface CastMember extends Person {
  cast_id: number;
  character: string;
  creditId: string;
  order: number;
  knownForDepartment: string;
}

export interface CrewMember extends Person {
  creditId: string;
  department: string;
  job: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Reviews {
  reviews: {
    id: number;
    page: number;
    results: Array<{
      id: string;
      author: string;
      content: string;
      createdAt: string;
      url: string;
    }>;
    totalPages: number;
    totalResults: number;
  };
}

export interface SimilarMovies {
  similarMovies: {
    id: number;
    page: number;
    results: Movie[];
    totalPages: number;
    totalResults: number;
  };
}

export interface Videos {
  videos: {
    id: number;
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
    }>;
  };
}

export interface Recommendations {
  recommendations: {
    page: number;
    results: Movie[];
    totalPages: number;
    totalResults: number;
  };
}

export interface Keywords {
  keywords: {
    id: number;
    keywords: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface Translations {
  translations: {
    id: number;
    translations: Array<{
      iso_3166_1: string;
      iso_639_1: string;
      name: string;
      englishName: string;
      data: {
        homepage: string;
        overview: string;
        runtime: number;
        tagline: string;
        title: string;
      };
    }>;
  };
}

export interface ReleaseDates {
  releaseDates: {
    id: number;
    results: Array<{
      iso_3166_1: string;
      releaseDates: Array<{
        certification: string;
        descriptors: string[];
        iso_639_1: string;
        note: string;
        releaseDate: string;
        type: number;
      }>;
    }>;
  };
}

export interface ExternalIds {
  externalIds: {
    id: number;
    imdbId: string | null;
    wikidataId: string | null;
    facebookId: string | null;
    instagramId: string | null;
    twitterId: string | null;
  };
}

export interface AccountStates {
  accountStates: {
    id: number;
    favorite: boolean;
    rated: boolean | { value: number };
    watchlist: boolean;
  };
}

export interface Images {
  images: {
    id: number;
    backdrops: Array<{
      aspectRatio: number;
      filePath: string;
      height: number;
      iso6391: string | null;
      voteAverage: number;
      voteCount: number;
      width: number;
    }>;
    posters: Array<{
      aspectRatio: number;
      filePath: string;
      height: number;
      iso6391: string | null;
      voteAverage: number;
      voteCount: number;
      width: number;
    }>;
  };
}

export interface PopularMovies {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
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
  backdropPath: string;
  belongsToCollection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdbId: string;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  releaseDate: string;
  revenue: number;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
};

export interface Options<T extends AppendOptions[]> {
  include?: T;
}

type AppendResponseMap = {
  credits: MovieCredits;
  reviews: Reviews;
  similar: SimilarMovies;
  videos: Videos;
  images: Images;
  recommendations: Recommendations;
  keywords: Keywords;
  translations: Translations;
  releaseDates: ReleaseDates;
  externalIds: ExternalIds;
  accountStates: AccountStates;
};

export type AppendResponse<T extends AppendOptions[]> = {
  [K in T[number]]: AppendResponseMap[K];
};

export type AppendOptions =
  | 'credits'
  | 'reviews'
  | 'similar'
  | 'videos'
  | 'images'
  | 'recommendations'
  | 'keywords'
  | 'translations'
  | 'releaseDates'
  | 'externalIds'
  | 'accountStates';
