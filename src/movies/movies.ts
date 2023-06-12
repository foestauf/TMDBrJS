import { IApiClient } from '..';
import { MoveiCreditsResponseBody } from './types/MovieCast';

interface Options {
  include?: IncludeOptions;
}

type IncludeOptions = {
  credits?: boolean;
  similar?: boolean;
};

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
    try {
      if (include?.credits) {
        const response = await this.apiClient.get(`/movie/${id}?append_to_response=credits`);
        return response;
      }
      const response = await this.apiClient.get(`/movie/${id}`);
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
