import { AppendOptions, AppendResponse, Options, Person, PopularPeople } from './types/Person';
import { MovieCredits } from './types/MovieCredit';
import { IApiClient } from '..';
import ApiURL from '../utils/apiURL';

class People {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular(page?: number) {
    const response = await this.apiClient.get<PopularPeople>('/person/popular?page=' + (page ?? '1'));
    return response;
  }

  async getById<T extends AppendOptions[]>(id: string, options?: Options<T>) {
    const { include } = options || {};
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

  async getMovieCredits(id: string) {
    const response = await this.apiClient.get<MovieCredits>(`person/${id}/movie_credits`);
    return response;
  }

  async getTvCredits(id: string) {
    const response = await this.apiClient.get(`person/${id}/tv_credits`);
    return response;
  }

  async getCombinedCredits(id: string) {
    const response = await this.apiClient.get(`person/${id}/combined_credits`);
    return response;
  }

  async getImages(id: string) {
    const response = await this.apiClient.get(`person/${id}/images`);
    return response;
  }

  /**
   * @deprecated
   * @param id string
   * @returns
   */
  async getTaggedImages(id: string) {
    const response = await this.apiClient.get(`3/person/${id}/tagged_images`);
    return response;
  }
}

export default People;
