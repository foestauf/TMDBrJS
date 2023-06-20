import { IApiClient } from '..';
import {
  MoveiCreditsResponseBody,
  Movie,
  MovieAppendResponse,
  MovieIncludeOptions,
  MovieOptions,
} from './types/MovieCast';

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

  async getById<T extends MovieIncludeOptions[]>(id: string, options?: MovieOptions<T>) {
    const { include } = options || {};
    const appendToResponse = include?.join(',');
    const url = `/movie/${id}`;
    if (appendToResponse) {
      url.concat(`?append_to_response=${appendToResponse}`);
    }
    try {
      const response = await this.apiClient.get<Movie & MovieAppendResponse<T>>(url);
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
