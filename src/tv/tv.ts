import {
  TvAppendOptions,
  Options,
  TvShow,
  PopularTvShows,
  TopRatedTvShows,
  AiringTodayTvShows,
  OnTheAirTvShows,
  TvCredits,
  AggregateCredits,
  TvExternalIds,
  TvImages,
  TvVideos,
  TvReviews,
  SimilarTvShows,
  TvRecommendations,
  TvKeywords,
  TvTranslations,
  TvContentRatings,
  TvWatchProviders,
  TvAlternativeTitles,
  TvEpisodeGroups,
  TvScreenedTheatrically,
  TvLists,
  TvChanges,
  TvAccountStates,
} from './types/TvShow';
import ApiURL from '../utils/apiURL';
import { BaseService, BaseAppendResponse } from '../utils/BaseService';

type TvAppendResponseMap = {
  credits: TvCredits;
  aggregateCredits: AggregateCredits;
  reviews: TvReviews;
  similar: SimilarTvShows;
  videos: TvVideos;
  images: TvImages;
  recommendations: TvRecommendations;
  keywords: TvKeywords;
  translations: TvTranslations;
  contentRatings: TvContentRatings;
  externalIds: TvExternalIds;
  accountStates: TvAccountStates;
  watchProviders: TvWatchProviders;
  alternativeTitles: TvAlternativeTitles;
  episodeGroups: TvEpisodeGroups;
  screenedTheatrically: TvScreenedTheatrically;
  lists: TvLists;
  changes: TvChanges;
};

class Tv extends BaseService<TvAppendOptions, TvAppendResponseMap> {
  async getPopular(page?: number): Promise<PopularTvShows> {
    const url = new ApiURL('tv/popular');
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<PopularTvShows>(url.toString());
    return response;
  }

  async getTopRated(page?: number): Promise<TopRatedTvShows> {
    const url = new ApiURL('tv/top_rated');
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<TopRatedTvShows>(url.toString());
    return response;
  }

  async getAiringToday(page?: number): Promise<AiringTodayTvShows> {
    const url = new ApiURL('tv/airing_today');
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<AiringTodayTvShows>(url.toString());
    return response;
  }

  async getOnTheAir(page?: number): Promise<OnTheAirTvShows> {
    const url = new ApiURL('tv/on_the_air');
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<OnTheAirTvShows>(url.toString());
    return response;
  }

  async getLatest(): Promise<TvShow> {
    const response = await this.apiClient.get<TvShow>('tv/latest');
    return response;
  }

  async getById<T extends TvAppendOptions[]>(
    id: string | number,
    options?: Options<T>,
  ): Promise<TvShow & BaseAppendResponse<T, TvAppendResponseMap>> {
    return this.getByIdWithAppendToResponse<T, TvShow>('tv/{id}', id, options);
  }

  async getCredits(id: string | number): Promise<TvCredits> {
    const url = new ApiURL(`tv/${id.toString()}/credits`);
    const response = await this.apiClient.get<TvCredits>(url.toString());
    return response;
  }

  async getAggregateCredits(id: string | number): Promise<AggregateCredits> {
    const url = new ApiURL(`tv/${id.toString()}/aggregate_credits`);
    const response = await this.apiClient.get<AggregateCredits>(url.toString());
    return response;
  }

  async getExternalIds(id: string | number): Promise<TvExternalIds> {
    const url = new ApiURL(`tv/${id.toString()}/external_ids`);
    const response = await this.apiClient.get<TvExternalIds>(url.toString());
    return response;
  }

  async getImages(id: string | number): Promise<TvImages> {
    const url = new ApiURL(`tv/${id.toString()}/images`);
    const response = await this.apiClient.get<TvImages>(url.toString());
    return response;
  }

  async getVideos(id: string | number): Promise<TvVideos> {
    const url = new ApiURL(`tv/${id.toString()}/videos`);
    const response = await this.apiClient.get<TvVideos>(url.toString());
    return response;
  }

  async getReviews(id: string | number, page?: number): Promise<TvReviews> {
    const url = new ApiURL(`tv/${id.toString()}/reviews`);
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<TvReviews>(url.toString());
    return response;
  }

  async getSimilar(id: string | number, page?: number): Promise<SimilarTvShows> {
    const url = new ApiURL(`tv/${id.toString()}/similar`);
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<SimilarTvShows>(url.toString());
    return response;
  }

  async getRecommendations(id: string | number, page?: number): Promise<TvRecommendations> {
    const url = new ApiURL(`tv/${id.toString()}/recommendations`);
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<TvRecommendations>(url.toString());
    return response;
  }

  async getKeywords(id: string | number): Promise<TvKeywords> {
    const url = new ApiURL(`tv/${id.toString()}/keywords`);
    const response = await this.apiClient.get<TvKeywords>(url.toString());
    return response;
  }

  async getTranslations(id: string | number): Promise<TvTranslations> {
    const url = new ApiURL(`tv/${id.toString()}/translations`);
    const response = await this.apiClient.get<TvTranslations>(url.toString());
    return response;
  }

  async getContentRatings(id: string | number): Promise<TvContentRatings> {
    const url = new ApiURL(`tv/${id.toString()}/content_ratings`);
    const response = await this.apiClient.get<TvContentRatings>(url.toString());
    return response;
  }

  async getWatchProviders(id: string | number): Promise<TvWatchProviders> {
    const url = new ApiURL(`tv/${id.toString()}/watch/providers`);
    const response = await this.apiClient.get<TvWatchProviders>(url.toString());
    return response;
  }

  async getAlternativeTitles(id: string | number): Promise<TvAlternativeTitles> {
    const url = new ApiURL(`tv/${id.toString()}/alternative_titles`);
    const response = await this.apiClient.get<TvAlternativeTitles>(url.toString());
    return response;
  }

  async getEpisodeGroups(id: string | number): Promise<TvEpisodeGroups> {
    const url = new ApiURL(`tv/${id.toString()}/episode_groups`);
    const response = await this.apiClient.get<TvEpisodeGroups>(url.toString());
    return response;
  }

  async getScreenedTheatrically(id: string | number): Promise<TvScreenedTheatrically> {
    const url = new ApiURL(`tv/${id.toString()}/screened_theatrically`);
    const response = await this.apiClient.get<TvScreenedTheatrically>(url.toString());
    return response;
  }

  async getLists(id: string | number, page?: number): Promise<TvLists> {
    const url = new ApiURL(`tv/${id.toString()}/lists`);
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<TvLists>(url.toString());
    return response;
  }

  async getChanges(id: string | number, startDate?: string, endDate?: string, page?: number): Promise<TvChanges> {
    const url = new ApiURL(`tv/${id.toString()}/changes`);
    if (startDate) {
      url.appendParam('start_date', startDate);
    }
    if (endDate) {
      url.appendParam('end_date', endDate);
    }
    if (page) {
      url.appendParam('page', page.toString());
    }
    const response = await this.apiClient.get<TvChanges>(url.toString());
    return response;
  }

  async getAccountStates(id: string | number): Promise<TvAccountStates> {
    const url = new ApiURL(`tv/${id.toString()}/account_states`);
    const response = await this.apiClient.get<TvAccountStates>(url.toString());
    return response;
  }

}

export default Tv;