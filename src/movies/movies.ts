import { IApiClient } from '..';
import { MoveiCreditsResponseBody } from './types/MovieCast';

interface Options {
  include?: IncludeOptions[];
}

type IncludeOptions = [
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

class Movies {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular() {
    const response = await this.apiClient.get('/movie/popular');
    return response;
  }

  async getTopRated() {
    const response = await this.apiClient.get('/movie/top_rated');
    return response;
  }

  async getById(id: string, options?: Options) {
    const { include } = options || {};
    const appendToResponse = include?.join(',');
    const url = `/movie/${id}?append_to_response=${appendToResponse}`;
    try {
      const response = await this.apiClient.get(url);
      return response;
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  async getSimilar(id: string) {
    const response = await this.apiClient.get(`/movie/${id}/similar`);
    return response;
  }

  async getCredits(id: string) {
    const response = await this.apiClient.get<MoveiCreditsResponseBody>(`/movie/${id}/credits`);
    return response;
  }
}

export default Movies;
