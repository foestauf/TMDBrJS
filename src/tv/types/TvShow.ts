import { Person } from '../../people/types/Person';

export interface CastMember extends Person {
  castId: number;
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

export interface TvCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface AggregateCredits {
  id: number;
  cast: Array<CastMember & {
    roles: Array<{
      creditId: string;
      character: string;
      episodeCount: number;
    }>;
  }>;
  crew: Array<CrewMember & {
    jobs: Array<{
      creditId: string;
      job: string;
      episodeCount: number;
    }>;
  }>;
}

export interface TvReviews {
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

export interface SimilarTvShows {
  similar: {
    id: number;
    page: number;
    results: TvShow[];
    totalPages: number;
    totalResults: number;
  };
}

export interface TvVideos {
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

export interface TvRecommendations {
  recommendations: {
    page: number;
    results: TvShow[];
    totalPages: number;
    totalResults: number;
  };
}

export interface TvKeywords {
  keywords: {
    id: number;
    keywords: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface TvTranslations {
  translations: {
    id: number;
    translations: Array<{
      iso31661: string;
      iso6391: string;
      name: string;
      englishName: string;
      data: {
        homepage: string;
        overview: string;
        name: string;
        tagline: string;
      };
    }>;
  };
}

export interface TvContentRatings {
  contentRatings: {
    id: number;
    results: Array<{
      iso31661: string;
      rating: string;
    }>;
  };
}

export interface TvExternalIds {
  externalIds: {
    id: number;
    imdbId: string | null;
    freebaseMid: string | null;
    freebaseId: string | null;
    tvdbId: number | null;
    tvrageId: number | null;
    wikidataId: string | null;
    facebookId: string | null;
    instagramId: string | null;
    twitterId: string | null;
  };
}

export interface TvAccountStates {
  accountStates: {
    id: number;
    favorite: boolean;
    rated: boolean | { value: number };
    watchlist: boolean;
  };
}

export interface TvImages {
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

export interface TvWatchProviders {
  watchProviders: {
    id: number;
    results: Record<string, {
      link: string;
      flatrate?: Array<{
        logoPath: string;
        providerId: number;
        providerName: string;
        displayPriority: number;
      }>;
      rent?: Array<{
        logoPath: string;
        providerId: number;
        providerName: string;
        displayPriority: number;
      }>;
      buy?: Array<{
        logoPath: string;
        providerId: number;
        providerName: string;
        displayPriority: number;
      }>;
    }>;
  };
}

export interface TvAlternativeTitles {
  alternativeTitles: {
    id: number;
    results: Array<{
      iso31661: string;
      title: string;
      type: string;
    }>;
  };
}

export interface TvEpisodeGroups {
  episodeGroups: {
    id: number;
    results: Array<{
      description: string;
      episodeCount: number;
      groupCount: number;
      id: string;
      name: string;
      network: {
        id: number;
        logoPath: string;
        name: string;
        originCountry: string;
      };
      type: number;
    }>;
  };
}

export interface TvScreenedTheatrically {
  screenedTheatrically: {
    id: number;
    results: Array<{
      id: number;
      episodeNumber: number;
      seasonNumber: number;
    }>;
  };
}

export interface TvLists {
  lists: {
    id: number;
    page: number;
    results: Array<{
      description: string;
      favoriteCount: number;
      id: number;
      itemCount: number;
      iso6391: string;
      listType: string;
      name: string;
      posterPath: string | null;
    }>;
    totalPages: number;
    totalResults: number;
  };
}

export interface TvChanges {
  changes: {
    changes: Array<{
      key: string;
      items: Array<{
        id: string;
        action: string;
        time: string;
        value: string | {
          episodeId: number;
          episodeNumber: number;
        };
        originalValue?: string;
      }>;
    }>;
  };
}

export interface PopularTvShows {
  page: number;
  results: TvShow[];
  totalPages: number;
  totalResults: number;
}

export interface TopRatedTvShows {
  page: number;
  results: TvShow[];
  totalPages: number;
  totalResults: number;
}

export interface AiringTodayTvShows {
  page: number;
  results: TvShow[];
  totalPages: number;
  totalResults: number;
}

export interface OnTheAirTvShows {
  page: number;
  results: TvShow[];
  totalPages: number;
  totalResults: number;
}

type Genre = {
  id: number;
  name: string;
};

type Network = {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
};

type ProductionCompany = {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
};

type ProductionCountry = {
  iso31661: string;
  name: string;
};

type SpokenLanguage = {
  englishName: string;
  iso6391: string;
  name: string;
};

type Season = {
  airDate: string;
  episodeCount: number;
  id: number;
  name: string;
  overview: string;
  posterPath: string;
  seasonNumber: number;
};

type Creator = {
  id: number;
  creditId: string;
  name: string;
  gender: number;
  profilePath: string;
};

export type TvShow = {
  adult: boolean;
  backdropPath: string;
  createdBy: Creator[];
  episodeRunTime: number[];
  firstAirDate: string;
  genres: Genre[];
  homepage: string;
  id: number;
  inProduction: boolean;
  languages: string[];
  lastAirDate: string;
  lastEpisodeToAir: {
    airDate: string;
    episodeNumber: number;
    id: number;
    name: string;
    overview: string;
    productionCode: string;
    runtime: number;
    seasonNumber: number;
    showId: number;
    stillPath: string;
    voteAverage: number;
    voteCount: number;
  };
  name: string;
  nextEpisodeToAir: {
    airDate: string;
    episodeNumber: number;
    id: number;
    name: string;
    overview: string;
    productionCode: string;
    runtime: number;
    seasonNumber: number;
    showId: number;
    stillPath: string;
    voteAverage: number;
    voteCount: number;
  } | null;
  networks: Network[];
  numberOfEpisodes: number;
  numberOfSeasons: number;
  originCountry: string[];
  originalLanguage: string;
  originalName: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  seasons: Season[];
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  voteAverage: number;
  voteCount: number;
};

export interface Options<T extends TvAppendOptions[]> {
  include?: T;
}


export type TvAppendOptions =
  | 'credits'
  | 'aggregateCredits'
  | 'reviews'
  | 'similar'
  | 'videos'
  | 'images'
  | 'recommendations'
  | 'keywords'
  | 'translations'
  | 'contentRatings'
  | 'externalIds'
  | 'accountStates'
  | 'watchProviders'
  | 'alternativeTitles'
  | 'episodeGroups'
  | 'screenedTheatrically'
  | 'lists'
  | 'changes';