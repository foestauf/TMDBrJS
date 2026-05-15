import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import { serializeDiscoverQuery } from './serializeQuery';
import type {
  MovieDiscoverQuery,
  TvDiscoverQuery,
  DiscoverMoviesResponse,
  DiscoverTvResponse,
} from './types/Discover';

class Discover {
  constructor(private apiClient: IApiClient) {}

  async movies(query?: MovieDiscoverQuery): Promise<DiscoverMoviesResponse> {
    const url = new ApiURL('discover/movie');
    serializeDiscoverQuery(url, query as Record<string, unknown> | undefined);
    return this.apiClient.get<DiscoverMoviesResponse>(url.toString());
  }

  async tv(query?: TvDiscoverQuery): Promise<DiscoverTvResponse> {
    const url = new ApiURL('discover/tv');
    serializeDiscoverQuery(url, query as Record<string, unknown> | undefined);
    return this.apiClient.get<DiscoverTvResponse>(url.toString());
  }
}

export default Discover;
