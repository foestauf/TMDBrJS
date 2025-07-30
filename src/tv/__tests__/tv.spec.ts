import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';
import { Options } from '../types/TvShow';

describe('Tv', () => {
  let tmdb: Client;

  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('getPopular', () => {
    it('should return a list of popular TV shows', async () => {
      const response = {
        results: [
          {
            id: '1',
            name: 'TV Show 1',
          },
          {
            id: '2',
            name: 'TV Show 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getPopular();

      expect(result).toEqual(response);
    });

    it('should support pagination', async () => {
      const response = {
        page: 2,
        results: [
          {
            id: '1',
            name: 'TV Show 1',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getPopular(2);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getTopRated', () => {
    it('should return a list of top rated TV shows', async () => {
      const response = {
        results: [
          {
            id: '1',
            name: 'TV Show 1',
          },
          {
            id: '2',
            name: 'TV Show 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getTopRated();

      expect(result).toEqual(response);
    });
  });

  describe('getAiringToday', () => {
    it('should return a list of TV shows airing today', async () => {
      const response = {
        results: [
          {
            id: '1',
            name: 'TV Show 1',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getAiringToday();

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('tv/airing_today'));
    });
  });

  describe('getOnTheAir', () => {
    it('should return a list of TV shows on the air', async () => {
      const response = {
        results: [
          {
            id: '1',
            name: 'TV Show 1',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getOnTheAir();

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('tv/on_the_air'));
    });
  });

  describe('getLatest', () => {
    it('should return the latest TV show', async () => {
      const response = {
        id: '1',
        name: 'Latest TV Show',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getLatest();

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith('tv/latest');
    });
  });

  describe('getById', () => {
    it('should return a TV show object', async () => {
      const tvId = '123';
      const response = {
        id: tvId,
        name: 'TV Show 1',
        firstAirDate: '2021-01-01',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getById(tvId);

      expect(result).toEqual(response);
    });

    it('should append response with options', async () => {
      const tvId = '123';
      const options: Options<['credits']> = {
        include: ['credits'],
      };
      const response = {
        id: tvId,
        name: 'TV Show 1',
        credits: {
          cast: [
            {
              id: 1,
              name: 'Actor 1',
            },
            {
              id: 2,
              name: 'Actor 2',
            },
          ],
        },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getById(tvId, options);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('append_to_response=credits'));
    });

    it('should convert TV-specific camelCase append options to snake_case', async () => {
      const tvId = '123';
      const options: Options<['aggregateCredits', 'contentRatings', 'externalIds']> = {
        include: ['aggregateCredits', 'contentRatings', 'externalIds'],
      };
      const response = {
        id: tvId,
        name: 'TV Show 1',
        aggregateCredits: { cast: [] },
        contentRatings: { results: [] },
        externalIds: { imdbId: 'tt123' },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getById(tvId, options);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(
        expect.stringMatching(/append_to_response=aggregate_credits(%2C|,)content_ratings(%2C|,)external_ids/),
      );
    });

    it('should throw an error if API call fails', async () => {
      const tvId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.tv.getById(tvId)).rejects.toThrow('Failed to fetch tv/{id}: API error');
    });
  });

  describe('getCredits', () => {
    it('should return TV show credits', async () => {
      const tvId = '123';
      const response = {
        cast: [
          {
            id: 1,
            name: 'Actor 1',
          },
          {
            id: 2,
            name: 'Actor 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getCredits(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/credits`));
    });
  });

  describe('getAggregateCredits', () => {
    it('should return TV show aggregate credits', async () => {
      const tvId = '123';
      const response = {
        cast: [
          {
            id: 1,
            name: 'Actor 1',
            roles: [
              {
                creditId: 'credit1',
                character: 'Character 1',
                episodeCount: 10,
              },
            ],
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getAggregateCredits(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/aggregate_credits`));
    });
  });

  describe('getExternalIds', () => {
    it('should return TV show external IDs', async () => {
      const tvId = '123';
      const response = {
        imdbId: 'tt123456',
        tvdbId: 789,
        facebookId: 'tvshow',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getExternalIds(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/external_ids`));
    });
  });

  describe('getContentRatings', () => {
    it('should return TV show content ratings', async () => {
      const tvId = '123';
      const response = {
        results: [
          {
            iso31661: 'US',
            rating: 'TV-14',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getContentRatings(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/content_ratings`));
    });
  });

  describe('getWatchProviders', () => {
    it('should return TV show watch providers', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        results: {
          US: {
            link: 'https://www.themoviedb.org/tv/123/watch?locale=US',
            flatrate: [
              {
                logoPath: '/logo.jpg',
                providerId: 8,
                providerName: 'Netflix',
                displayPriority: 0,
              },
            ],
          },
        },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getWatchProviders(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/watch/providers`));
    });
  });

  describe('getImages', () => {
    it('should return TV show images', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        backdrops: [
          {
            aspectRatio: 1.777,
            filePath: '/backdrop.jpg',
            height: 1080,
            iso6391: null,
            voteAverage: 7.5,
            voteCount: 100,
            width: 1920,
          },
        ],
        posters: [
          {
            aspectRatio: 0.666,
            filePath: '/poster.jpg',
            height: 1500,
            iso6391: null,
            voteAverage: 7.5,
            voteCount: 100,
            width: 1000,
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getImages(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/images`));
    });
  });

  describe('getVideos', () => {
    it('should return TV show videos', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        results: [
          {
            id: 'video1',
            key: 'dQw4w9WgXcQ',
            name: 'Official Trailer',
            site: 'YouTube',
            size: 1080,
            type: 'Trailer',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getVideos(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/videos`));
    });
  });

  describe('getReviews', () => {
    it('should return TV show reviews', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        page: 1,
        results: [
          {
            id: 'review1',
            author: 'reviewer123',
            content: 'Great show!',
            createdAt: '2023-01-01T00:00:00.000Z',
            url: 'https://example.com/review',
          },
        ],
        totalPages: 1,
        totalResults: 1,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getReviews(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/reviews`));
    });

    it('should support pagination for reviews', async () => {
      const tvId = '123';
      const page = 2;
      const response = { id: 123, page, results: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getReviews(tvId, page);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getSimilar', () => {
    it('should return similar TV shows', async () => {
      const tvId = '123';
      const response = {
        page: 1,
        results: [
          {
            id: 456,
            name: 'Similar Show',
            firstAirDate: '2023-01-01',
          },
        ],
        totalPages: 1,
        totalResults: 1,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getSimilar(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/similar`));
    });

    it('should support pagination for similar shows', async () => {
      const tvId = '123';
      const page = 2;
      const response = { page, results: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getSimilar(tvId, page);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getRecommendations', () => {
    it('should return TV show recommendations', async () => {
      const tvId = '123';
      const response = {
        page: 1,
        results: [
          {
            id: 789,
            name: 'Recommended Show',
            firstAirDate: '2023-02-01',
          },
        ],
        totalPages: 1,
        totalResults: 1,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getRecommendations(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/recommendations`));
    });

    it('should support pagination for recommendations', async () => {
      const tvId = '123';
      const page = 3;
      const response = { page, results: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getRecommendations(tvId, page);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=3'));
    });
  });

  describe('getKeywords', () => {
    it('should return TV show keywords', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        results: [
          {
            id: 1,
            name: 'comedy',
          },
          {
            id: 2,
            name: 'family',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getKeywords(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/keywords`));
    });
  });

  describe('getTranslations', () => {
    it('should return TV show translations', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        translations: [
          {
            iso31661: 'FR',
            iso6391: 'fr',
            name: 'Français',
            englishName: 'French',
            data: {
              name: 'Nom en français',
              overview: 'Description en français',
              homepage: '',
            },
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getTranslations(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/translations`));
    });
  });

  describe('getAlternativeTitles', () => {
    it('should return TV show alternative titles', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        titles: [
          {
            iso31661: 'US',
            title: 'Alternative Title',
            type: 'original title',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getAlternativeTitles(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/alternative_titles`));
    });
  });

  describe('getEpisodeGroups', () => {
    it('should return TV show episode groups', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        results: [
          {
            id: 'group1',
            name: 'Season 1',
            description: 'First season episodes',
            episodeCount: 10,
            groupCount: 1,
            type: 1,
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getEpisodeGroups(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/episode_groups`));
    });
  });

  describe('getScreenedTheatrically', () => {
    it('should return TV show theatrical screenings', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        results: [
          {
            id: 1,
            episodeNumber: 1,
            seasonNumber: 1,
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getScreenedTheatrically(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/screened_theatrically`));
    });
  });

  describe('getLists', () => {
    it('should return TV show lists', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        page: 1,
        results: [
          {
            id: 'list1',
            name: 'Best TV Shows',
            description: 'A list of the best TV shows',
            favoriteCount: 100,
            itemCount: 50,
            iso6391: 'en',
            listType: 'tv',
            posterPath: '/poster.jpg',
          },
        ],
        totalPages: 1,
        totalResults: 1,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getLists(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/lists`));
    });

    it('should support pagination for lists', async () => {
      const tvId = '123';
      const page = 2;
      const response = { page, results: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getLists(tvId, page);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getChanges', () => {
    it('should return TV show changes', async () => {
      const tvId = '123';
      const response = {
        changes: [
          {
            key: 'name',
            items: [
              {
                id: 'change1',
                action: 'updated',
                time: '2023-01-01T00:00:00.000Z',
                originalValue: 'Old Name',
                value: 'New Name',
              },
            ],
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getChanges(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/changes`));
    });

    it('should support date range for changes', async () => {
      const tvId = '123';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const response = { changes: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getChanges(tvId, startDate, endDate);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/start_date=2023-01-01/));
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/end_date=2023-01-31/));
    });

    it('should support pagination for changes', async () => {
      const tvId = '123';
      const page = 2;
      const response = { changes: [] };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      await tmdb.tv.getChanges(tvId, undefined, undefined, page);

      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getAccountStates', () => {
    it('should return TV show account states', async () => {
      const tvId = '123';
      const response = {
        id: 123,
        favorite: false,
        rated: false,
        watchlist: true,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.tv.getAccountStates(tvId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`tv/${tvId}/account_states`));
    });
  });
});
