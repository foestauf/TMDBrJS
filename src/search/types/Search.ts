import type { Movie } from '../../movies/types/MovieCast';
import type { TvShow } from '../../tv/types/TvShow';
import type { Person } from '../../people/types/Person';
import type { Paginated } from '../../utils/types';

export interface BaseSearchOptions {
  page?: number;
  includeAdult?: boolean;
}

export interface MovieSearchOptions extends BaseSearchOptions {
  region?: string;
  year?: number;
  primaryReleaseYear?: number;
}

export interface TvSearchOptions extends BaseSearchOptions {
  firstAirDateYear?: number;
}

export type PeopleSearchOptions = BaseSearchOptions;

export interface KeywordResult {
  id: number;
  name: string;
}

export interface CompanyResult {
  id: number;
  logoPath: string | null;
  name: string;
  originCountry: string;
}

export interface CollectionResult {
  id: number;
  name: string;
  posterPath: string | null;
  backdropPath: string | null;
}

export type MultiSearchResult =
  | (Movie & { mediaType: 'movie' })
  | (TvShow & { mediaType: 'tv' })
  | (Person & { mediaType: 'person' });

export type MultiSearchResponse = Paginated<MultiSearchResult>;
export type MovieSearchResponse = Paginated<Movie>;
export type TvSearchResponse = Paginated<TvShow>;
export type PeopleSearchResponse = Paginated<Person>;
export type KeywordSearchResponse = Paginated<KeywordResult>;
export type CompanySearchResponse = Paginated<CompanyResult>;
export type CollectionSearchResponse = Paginated<CollectionResult>;
