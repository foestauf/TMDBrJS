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

});