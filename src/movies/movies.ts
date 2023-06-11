import { IApiClient } from '..';

class Movies {
  apiClient: IApiClient;
  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getPopular() {
    const response = await this.apiClient.get('/movie/popular');
    return response;
  }

  async getTopRated() {
    const response = await this.apiClient.get('/movie/top_rated');
    return response;
  }

  async getById(id: string) {
    const response = await this.apiClient.get(`/movie/${id}`);
    return response;
  }

  async getSimilar(id: string) {
    const response = await this.apiClient.get(`/movie/${id}/similar`);
    return response;
  }
}

export default Movies;
