import { Person } from './types/Person';
import { MovieCredits } from './types/MovieCredit';
import { IApiClient } from '..';

class People {
  apiClient: IApiClient;
  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  async getPopular() {
    const response = await this.apiClient.get('/person/popular');
    return response.data;
  }

  async getById(id: string) {
    const response = await this.apiClient.get<Person>(`/person/${id}`);
    return response;
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
