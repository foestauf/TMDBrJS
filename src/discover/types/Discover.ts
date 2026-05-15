import type { Movie } from '../../movies/types/MovieCast';
import type { TvShow } from '../../tv/types/TvShow';
import type { Paginated } from '../../utils/types';

export type SortBy =
  | 'popularity.asc'
  | 'popularity.desc'
  | 'release_date.asc'
  | 'release_date.desc'
  | 'revenue.asc'
  | 'revenue.desc'
  | 'primary_release_date.asc'
  | 'primary_release_date.desc'
  | 'original_title.asc'
  | 'original_title.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'vote_count.asc'
  | 'vote_count.desc'
  | 'first_air_date.asc'
  | 'first_air_date.desc';

export interface BaseDiscoverQuery {
  page?: number;
  sortBy?: SortBy;
  language?: string;
  region?: string;
  withGenres?: number[] | string;
  withoutGenres?: number[] | string;
  withKeywords?: number[] | string;
  withoutKeywords?: number[] | string;
  withCompanies?: number[] | string;
  withWatchProviders?: number[] | string;
  watchRegion?: string;
  withRuntimeGte?: number;
  withRuntimeLte?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
  voteCountGte?: number;
  voteCountLte?: number;
  withOriginalLanguage?: string;
  includeAdult?: boolean;
  includeVideo?: boolean;
}

export interface MovieDiscoverQuery extends BaseDiscoverQuery {
  primaryReleaseYear?: number;
  primaryReleaseDateGte?: string;
  primaryReleaseDateLte?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  year?: number;
  withPeople?: number[] | string;
  withReleaseType?: number;
  certificationCountry?: string;
  certification?: string;
  certificationLte?: string;
  certificationGte?: string;
}

export interface TvDiscoverQuery extends BaseDiscoverQuery {
  firstAirDateYear?: number;
  firstAirDateGte?: string;
  firstAirDateLte?: string;
  airDateGte?: string;
  airDateLte?: string;
  timezone?: string;
  withNetworks?: number[] | string;
  withStatus?: string;
  withType?: string;
  includeNullFirstAirDates?: boolean;
  screenedTheatrically?: boolean;
}

export type DiscoverMoviesResponse = Paginated<Movie>;
export type DiscoverTvResponse = Paginated<TvShow>;
