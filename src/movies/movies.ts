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
