import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  BaseSearchOptions,
  MultiSearchResponse,
  MovieSearchOptions,
  MovieSearchResponse,
  TvSearchOptions,
  TvSearchResponse,
  PeopleSearchOptions,
  PeopleSearchResponse,
  KeywordSearchResponse,
  CompanySearchResponse,
  CollectionSearchResponse,
} from './types/Search';

function applyBaseSearchParams(url: ApiURL, query: string, opts?: BaseSearchOptions): void {
  url.appendParam('query', query);
  if (opts?.page) url.appendParam('page', opts.page.toString());
  if (opts?.includeAdult !== undefined) url.appendParam('include_adult', String(opts.includeAdult));
}

class Search {
  constructor(private readonly apiClient: IApiClient) {}

  async multi(query: string, opts?: BaseSearchOptions): Promise<MultiSearchResponse> {
    const url = new ApiURL('search/multi');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<MultiSearchResponse>(url.toString());
  }

  async movies(query: string, opts?: MovieSearchOptions): Promise<MovieSearchResponse> {
    const url = new ApiURL('search/movie');
    applyBaseSearchParams(url, query, opts);
    if (opts?.region) url.appendParam('region', opts.region);
    if (opts?.year !== undefined) url.appendParam('year', opts.year.toString());
    if (opts?.primaryReleaseYear !== undefined) url.appendParam('primary_release_year', opts.primaryReleaseYear.toString());
    return this.apiClient.get<MovieSearchResponse>(url.toString());
  }

  async tv(query: string, opts?: TvSearchOptions): Promise<TvSearchResponse> {
    const url = new ApiURL('search/tv');
    applyBaseSearchParams(url, query, opts);
    if (opts?.firstAirDateYear !== undefined) url.appendParam('first_air_date_year', opts.firstAirDateYear.toString());
    return this.apiClient.get<TvSearchResponse>(url.toString());
  }

  async people(query: string, opts?: PeopleSearchOptions): Promise<PeopleSearchResponse> {
    const url = new ApiURL('search/person');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<PeopleSearchResponse>(url.toString());
  }

  async keywords(query: string, opts?: BaseSearchOptions): Promise<KeywordSearchResponse> {
    const url = new ApiURL('search/keyword');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<KeywordSearchResponse>(url.toString());
  }

  async companies(query: string, opts?: BaseSearchOptions): Promise<CompanySearchResponse> {
    const url = new ApiURL('search/company');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<CompanySearchResponse>(url.toString());
  }

  async collections(query: string, opts?: BaseSearchOptions): Promise<CollectionSearchResponse> {
    const url = new ApiURL('search/collection');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<CollectionSearchResponse>(url.toString());
  }
}

export default Search;
