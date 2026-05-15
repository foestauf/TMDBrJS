import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  TrendingWindow,
  TrendingAllResponse,
  TrendingMoviesResponse,
  TrendingTvResponse,
  TrendingPeopleResponse,
} from './types/Trending';

class Trending {
  constructor(private apiClient: IApiClient) {}

  async all(window: TrendingWindow): Promise<TrendingAllResponse> {
    const url = new ApiURL(`trending/all/${window}`);
    return this.apiClient.get<TrendingAllResponse>(url.toString());
  }

  async movies(window: TrendingWindow): Promise<TrendingMoviesResponse> {
    const url = new ApiURL(`trending/movie/${window}`);
    return this.apiClient.get<TrendingMoviesResponse>(url.toString());
  }

  async tv(window: TrendingWindow): Promise<TrendingTvResponse> {
    const url = new ApiURL(`trending/tv/${window}`);
    return this.apiClient.get<TrendingTvResponse>(url.toString());
  }

  async people(window: TrendingWindow): Promise<TrendingPeopleResponse> {
    const url = new ApiURL(`trending/person/${window}`);
    return this.apiClient.get<TrendingPeopleResponse>(url.toString());
  }
}

export default Trending;
