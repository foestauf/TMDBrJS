import { IApiClient } from '..';
import { AppendOptions, AppendResponse, MovieCredits, Movie, Options, PopularMovies } from './types/MovieCast';
import ApiURL from '../utils/apiURL';

class Movies {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular(page?: number) {
    return await this.apiClient.get<PopularMovies>('movie/popular?page=' + (page?.toString() ?? '1'));
  }

  async getTopRated() {
    const response = await this.apiClient.get('movie/top_rated');
    return response;
  }

  async getById<T extends AppendOptions[]>(id: string, options?: Options<T>): Promise<Movie & AppendResponse<T>> {
    const { include } = options ?? { include: [] };
    const appendToResponse = include?.join(',');
    const url = new ApiURL(`movie/${id}`);
    if (appendToResponse) {
      url.appendParam('append_to_response', appendToResponse);
    }
    try {
      return await this.apiClient.get<Movie & AppendResponse<T>>(url.toString());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Something went wrong');
    }
  }

  async getSimilar(id: string) {
    const response = await this.apiClient.get(`movie/${id}/similar`);
    return response;
  }

  async getCredits(id: string) {
    const response = await this.apiClient.get<MovieCredits>(`movie/${id}/credits`);
    return response;
  }
}

export default Movies;
