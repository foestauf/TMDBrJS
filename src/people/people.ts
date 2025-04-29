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
import { camelToSnakeCaseArray } from '../utils/caseConversion';

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

  async getById<T extends AppendOptions[]>(
    id: string | number,
    options?: Options<T>,
  ): Promise<Person & AppendResponse<T>> {
    const { include } = options ?? {};
    // Convert camelCase options to snake_case for the API
    const appendToResponse = include ? camelToSnakeCaseArray(include).join(',') : undefined;

    const url = new ApiURL(`person/${id.toString()}`);
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

  async getMovieCredits(id: string | number): Promise<MovieCredits> {
    const response = await this.apiClient.get<MovieCredits>(`person/${id.toString()}/movie_credits`);
    return response;
  }

  async getTvCredits(id: string | number): Promise<TvCredits> {
    const response = await this.apiClient.get<TvCredits>(`person/${id.toString()}/tv_credits`);
    return response;
  }

  async getCombinedCredits(id: string | number): Promise<CombinedCredits> {
    const response = await this.apiClient.get<CombinedCredits>(`person/${id.toString()}/combined_credits`);
    return response;
  }

  async getImages(id: string | number): Promise<Images> {
    const response = await this.apiClient.get<Images>(`person/${id.toString()}/images`);
    return response;
  }

  /**
   * @deprecated Use getImages instead
   * @param id string | number
   * @returns Promise<Images>
   */
  async getTaggedImages(id: string | number): Promise<Images> {
    const response = await this.apiClient.get<Images>(`3/person/${id.toString()}/tagged_images`);
    return response;
  }
}

export default People;
