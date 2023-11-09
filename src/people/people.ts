import { AppendOptions, AppendResponse, Options, Person } from './types/Person';
import { MovieCredits } from './types/MovieCredit';
import { IApiClient } from '..';

class People {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular() {
    const response = await this.apiClient.get('/person/popular');
    return response.data;
  }

  async getById<T extends AppendOptions[]>(id: string, options?: Options<T>) {
    const { include } = options || {};
    const appendToResponse = include?.join(',');
    const url = `/person/${id}`;
    if (appendToResponse) {
      url.concat(`?append_to_response=${appendToResponse}`);
    }
    try {
      const response = await this.apiClient.get<Person & AppendResponse<T>>(url);
      return response;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Something went wrong');
    }
  }

  async getMovieCredits(id: string) {
    const response = await this.apiClient.get<MovieCredits>(`/person/${id}/movie_credits`);
    return response;
  }

  async getTvCredits(id: string) {
    const response = await this.apiClient.get(`/person/${id}/tv_credits`);
    return response;
  }

  async getCombinedCredits(id: string) {
    const response = await this.apiClient.get(`/person/${id}/combined_credits`);
    return response;
  }

  async getImages(id: string) {
    const response = await this.apiClient.get(`/person/${id}/images`);
    return response;
  }

  /**
   * @deprecated
   * @param id string
   * @returns
   */
  async getTaggedImages(id: string) {
    const response = await this.apiClient.get(`/person/${id}/tagged_images`);
    return response;
  }
}

export default People;
