import {
  AppendOptions,
  Options,
  Person,
  PopularPeople,
  TvCredits,
  CombinedCredits,
  Images,
  ExternalIds,
  TaggedImages,
  Translations,
} from './types/Person';
import { MovieCredits } from './types/MovieCredit';
import ApiURL from '../utils/apiURL';
import { BaseService, BaseAppendResponse } from '../utils/BaseService';

type PeopleAppendResponseMap = {
  movieCredits: MovieCredits;
  tvCredits: TvCredits;
  combinedCredits: CombinedCredits;
  images: Images;
  latest: Person;
  externalIds: ExternalIds;
  taggedImages: TaggedImages;
  translations: Translations;
};

class People extends BaseService<AppendOptions, PeopleAppendResponseMap> {
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
  ): Promise<Person & BaseAppendResponse<T, PeopleAppendResponseMap>> {
    return this.getByIdWithAppendToResponse<T, Person>('person/{id}', id, options);
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
