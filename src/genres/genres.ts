import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type { GenreList } from './types/Genre';

class Genres {
  constructor(private apiClient: IApiClient) {}

  async movies(): Promise<GenreList> {
    const url = new ApiURL('genre/movie/list');
    return this.apiClient.get<GenreList>(url.toString());
  }

  async tv(): Promise<GenreList> {
    const url = new ApiURL('genre/tv/list');
    return this.apiClient.get<GenreList>(url.toString());
  }
}

export default Genres;
