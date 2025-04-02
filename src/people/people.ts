import {
  AppendOptions,
  AppendResponse,
  Options,
  Person,
  PopularPeople,
  TvCredits,
  CombinedCredits,
  Images,
} from './types/Person';
import { MovieCredits } from './types/MovieCredit';
import { IApiClient } from '..';
import ApiURL from '../utils/apiURL';

class People {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular(page?: number): Promise<PopularPeople> {
    const url = new ApiURL('person/popular');
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<PopularPeople>(url.toString());
    return response;
  }

  async getById<T extends AppendOptions[]>(id: string, options?: Options<T>): Promise<Person & AppendResponse<T>> {
    const { include } = options ?? {};
    const appendToResponse = include?.join(',');
    const url = new ApiURL(`person/${id}`);
    if (appendToResponse) {
      url.appendParam('append_to_response', appendToResponse);
    }
    try {
      return await this.apiClient.get<Person & AppendResponse<T>>(url.toString());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Something went wrong');
    }
  }

  async getMovieCredits(id: string): Promise<MovieCredits> {
    const response = await this.apiClient.get<MovieCredits>(`person/${id}/movie_credits`);
    return response;
  }

  async getTvCredits(id: string): Promise<TvCredits> {
    const response = await this.apiClient.get<TvCredits>(`person/${id}/tv_credits`);
    return response;
  }

  async getCombinedCredits(id: string): Promise<CombinedCredits> {
    const response = await this.apiClient.get<CombinedCredits>(`person/${id}/combined_credits`);
    return response;
  }

  async getImages(id: string): Promise<Images> {
    const response = await this.apiClient.get<Images>(`person/${id}/images`);
    return response;
  }

  /**
   * @deprecated Use getImages instead
   * @param id string
   * @returns Promise<Images>
   */
  async getTaggedImages(id: string): Promise<Images> {
    const response = await this.apiClient.get<Images>(`3/person/${id}/tagged_images`);
    return response;
  }
}

export default People;
