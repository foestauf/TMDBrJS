import {
  AppendOptions,
  AppendResponse,
  MovieCredits,
  Movie,
  Options,
  PopularMovies,
  Reviews,
  SimilarMovies,
  Videos,
  Images,
  Recommendations,
  Keywords,
  Translations,
  ReleaseDates,
  ExternalIds,
  AccountStates,
} from './types/MovieCast.js';
import { BaseService } from '../utils/BaseService';
import ApiURL from '../utils/apiURL';

type MovieAppendResponseMap = {
  credits: MovieCredits;
  reviews: Reviews;
  similar: SimilarMovies;
  videos: Videos;
  images: Images;
  recommendations: Recommendations;
  keywords: Keywords;
  translations: Translations;
  releaseDates: ReleaseDates;
  externalIds: ExternalIds;
  accountStates: AccountStates;
};

class Movies extends BaseService<AppendOptions, MovieAppendResponseMap> {
  async getPopular(page?: number) {
    const url = new ApiURL('movie/popular');
    if (page) url.appendParam('page', page.toString());
    return this.apiClient.get<PopularMovies>(url.toString());
  }

  async getTopRated() {
    const response = await this.apiClient.get('movie/top_rated');
    return response;
  }

  async getById<T extends AppendOptions[]>(
    id: string | number,
    options?: Options<T>,
  ): Promise<Movie & AppendResponse<T>> {
    return this.getByIdWithAppendToResponse<T, Movie>('movie/{id}', id, options);
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
