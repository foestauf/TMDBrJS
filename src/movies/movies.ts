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
import type { NowPlayingMovies, UpcomingMovies } from './types/Lists';
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

  async getTopRated(page?: number): Promise<PopularMovies> {
    const url = new ApiURL('movie/top_rated');
    if (page) url.appendParam('page', page.toString());
    return this.apiClient.get<PopularMovies>(url.toString());
  }

  async getById<T extends AppendOptions[]>(
    id: string | number,
    options?: Options<T>,
  ): Promise<Movie & AppendResponse<T>> {
    return this.getByIdWithAppendToResponse<T, Movie>('movie/{id}', id, options);
  }

  async getSimilar(id: string | number, page?: number): Promise<SimilarMovies> {
    const url = new ApiURL(`movie/${id.toString()}/similar`);
    if (page) url.appendParam('page', page.toString());
    return this.apiClient.get<SimilarMovies>(url.toString());
  }

  async getCredits(id: string | number): Promise<MovieCredits> {
    const url = new ApiURL(`movie/${id.toString()}/credits`);
    return this.apiClient.get<MovieCredits>(url.toString());
  }

  async getDetails(id: string | number): Promise<Movie> {
    const url = new ApiURL(`movie/${id.toString()}`);
    return this.apiClient.get<Movie>(url.toString());
  }

  /**
   * @deprecated Use {@link Movies.getCredits} instead. This duplicate will be removed in a future major release.
   */
  async getMovieCredits(id: string | number): Promise<MovieCredits> {
    return this.getCredits(id);
  }

  async getNowPlaying(page?: number): Promise<NowPlayingMovies> {
    const url = new ApiURL('movie/now_playing');
    if (page) url.appendParam('page', page.toString());
    return this.apiClient.get<NowPlayingMovies>(url.toString());
  }

  async getUpcoming(page?: number): Promise<UpcomingMovies> {
    const url = new ApiURL('movie/upcoming');
    if (page) url.appendParam('page', page.toString());
    return this.apiClient.get<UpcomingMovies>(url.toString());
  }

  async getLatest(): Promise<Movie> {
    const url = new ApiURL('movie/latest');
    return this.apiClient.get<Movie>(url.toString());
  }

  async getImages(id: string | number): Promise<Images> {
    const url = new ApiURL(`movie/${id.toString()}/images`);
    return this.apiClient.get<Images>(url.toString());
  }

  async getVideos(id: string | number): Promise<Videos> {
    const url = new ApiURL(`movie/${id.toString()}/videos`);
    return this.apiClient.get<Videos>(url.toString());
  }
}

export default Movies;
