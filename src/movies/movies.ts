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

  async getById<T extends AppendOptions[]>(
    id: string | number,
    options?: Options<T>,
  ): Promise<Movie & AppendResponse<T>> {
    const { include } = options ?? { include: [] };
    const appendToResponse = include?.join(',');
    const url = new ApiURL(`movie/${id.toString()}`);
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

  async getSimilar(id: string | number) {
    const response = await this.apiClient.get(`movie/${id.toString()}/similar`);
    return response;
  }

  async getCredits(id: string | number) {
    const response = await this.apiClient.get<MovieCredits>(`movie/${id.toString()}/credits`);
    return response;
  }

  async getDetails(id: string | number) {
    const response = await this.apiClient.get<Movie>(`movie/${id.toString()}`);
    return response;
  }

  async getMovieCredits(id: string | number) {
    const response = await this.apiClient.get<MovieCredits>(`movie/${id.toString()}/credits`);
    return response;
  }
}

export default Movies;
