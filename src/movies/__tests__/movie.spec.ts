import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';
import { Options } from '../types/MovieCast';

describe('Movies', () => {
  let tmdb: Client;

  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('getPopular', () => {
    it('should return a list of popular movies', async () => {
      const response = {
        results: [
          {
            id: '1',
            title: 'Movie 1',
          },
          {
            id: '2',
            title: 'Movie 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getPopular();

      expect(result).toEqual(response);
    });

    it('omits the page param when no page is provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getPopular();
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).not.toContain('page=');
      expect(calledWith).toContain('movie/popular');
    });

    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getPopular(3);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=3'));
    });
  });

  describe('getTopRated', () => {
    it('should return a list of top rated movies', async () => {
      const response = {
        results: [
          {
            id: '1',
            title: 'Movie 1',
          },
          {
            id: '2',
            title: 'Movie 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getTopRated();

      expect(result).toEqual(response);
    });

    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getTopRated(2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });

    it('hits movie/top_rated', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getTopRated();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/top_rated'));
    });
  });

  describe('getById', () => {
    it('should return a movie object', async () => {
      const movieId = '123';
      const response = {
        id: movieId,
        title: 'Movie 1',
        release_date: '2021-01-01',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId);

      expect(result).toEqual(response);
    });

    it('should append response with options', async () => {
      const movieId = '123';
      const options: Options<['credits']> = {
        include: ['credits'],
      };
      const response = {
        id: movieId,
        title: 'Movie 1',
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

      const result = await tmdb.movies.getById(movieId, options);

      expect(result).toEqual(response);
      // Verify that the URL was constructed correctly with snake_case
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('append_to_response=credits'));
    });

    it('should convert multiple camelCase append options to snake_case', async () => {
      const movieId = '123';
      const options: Options<['credits', 'videos', 'images']> = {
        include: ['credits', 'videos', 'images'],
      };
      const response = {
        id: movieId,
        title: 'Movie 1',
        credits: { cast: [] },
        videos: { results: [] },
        images: { backdrops: [], posters: [] },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId, options);

      expect(result).toEqual(response);
      // Verify that the URL was constructed correctly with snake_case
      // URL encoding converts commas to %2C
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(
        expect.stringMatching(/append_to_response=credits(%2C|,)videos(%2C|,)images/),
      );
    });

    it('should support new append options', async () => {
      const movieId = '123';
      const options: Options<['recommendations', 'keywords', 'externalIds']> = {
        include: ['recommendations', 'keywords', 'externalIds'],
      };
      const response = {
        id: movieId,
        title: 'Movie 1',
        recommendations: { results: [] },
        keywords: { keywords: [] },
        externalIds: { imdbId: 'tt123' },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId, options);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(
        expect.stringMatching(/append_to_response=recommendations(%2C|,)keywords(%2C|,)external_ids/),
      );
    });

    it('should throw an error if API call fails', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.movies.getById(movieId)).rejects.toThrow('Failed to fetch movie/{id}: API error');
    });
  });

  describe('getSimilar', () => {
    it('should return a list of similar movies', async () => {
      const movieId = '123';
      const response = {
        results: [
          {
            id: '1',
            title: 'Movie 1',
          },
          {
            id: '2',
            title: 'Movie 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getSimilar(movieId);

      expect(result).toEqual(response);
    });

    it('hits movie/{id}/similar', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getSimilar('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/similar'));
    });

    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
      await tmdb.movies.getSimilar('550', 2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getCredits', () => {
    it('should return a list of movie credits', async () => {
      const movieId = '123';
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

      const result = await tmdb.movies.getCredits(movieId);

      expect(result).toEqual(response);
    });
  });

  describe('getDetails', () => {
    it('should return movie details', async () => {
      const movieId = '123';
      const response = {
        id: 123,
        title: 'Test Movie',
        overview: 'A test movie',
        releaseDate: '2023-01-01',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getDetails(movieId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/movie\/123(?!\/)/));
    });

    it('hits movie/{id}', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, title: 'Fight Club' });
      const result = await tmdb.movies.getDetails(550);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/movie\/550(?!\/)/));
      expect(result).toEqual({ id: 550, title: 'Fight Club' });
    });
  });

  describe('getMovieCredits', () => {
    it('should return movie credits', async () => {
      const movieId = '123';
      const response = {
        id: 123,
        cast: [
          {
            id: 1,
            name: 'Actor 1',
          },
        ],
        crew: [
          {
            id: 2,
            name: 'Director 1',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getMovieCredits(movieId);

      expect(result).toEqual(response);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining(`movie/${movieId}/credits`));
    });
  });

  describe('getNowPlaying', () => {
    it('hits movie/now_playing', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
      await tmdb.movies.getNowPlaying();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/now_playing'));
    });
    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
      await tmdb.movies.getNowPlaying(4);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=4'));
    });
  });

  describe('getUpcoming', () => {
    it('hits movie/upcoming', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
      await tmdb.movies.getUpcoming();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/upcoming'));
    });
    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
      await tmdb.movies.getUpcoming(5);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=5'));
    });
  });

  describe('getLatest', () => {
    it('hits movie/latest', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 123, title: 'Latest' });
      const result = await tmdb.movies.getLatest();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/latest'));
      expect(result).toEqual({ id: 123, title: 'Latest' });
    });
  });

  describe('getImages', () => {
    it('hits movie/{id}/images', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, backdrops: [], posters: [] });
      await tmdb.movies.getImages('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/images'));
    });
  });

  describe('getVideos', () => {
    it('hits movie/{id}/videos', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: [] });
      await tmdb.movies.getVideos('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/videos'));
    });
  });

  describe('getReviews', () => {
    it('hits movie/{id}/reviews', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.movies.getReviews('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/reviews'));
    });
    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 2, results: [], totalPages: 2, totalResults: 0 });
      await tmdb.movies.getReviews('550', 2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getRecommendations', () => {
    it('hits movie/{id}/recommendations', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.movies.getRecommendations('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/recommendations'));
    });
    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 2, results: [], totalPages: 2, totalResults: 0 });
      await tmdb.movies.getRecommendations('550', 2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getKeywords', () => {
    it('hits movie/{id}/keywords', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, keywords: [] });
      await tmdb.movies.getKeywords('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/keywords'));
    });
  });

  describe('getReleaseDates', () => {
    it('hits movie/{id}/release_dates', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: [] });
      await tmdb.movies.getReleaseDates('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/release_dates'));
    });
  });

  describe('getTranslations', () => {
    it('hits movie/{id}/translations', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, translations: [] });
      await tmdb.movies.getTranslations('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/translations'));
    });
  });

  describe('getExternalIds', () => {
    it('hits movie/{id}/external_ids', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, imdbId: 'tt0137523' });
      await tmdb.movies.getExternalIds('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/external_ids'));
    });
  });

  describe('getAlternativeTitles', () => {
    it('hits movie/{id}/alternative_titles', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, titles: [] });
      await tmdb.movies.getAlternativeTitles('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/alternative_titles'));
    });
  });

  describe('getWatchProviders', () => {
    it('hits movie/{id}/watch/providers', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: {} });
      await tmdb.movies.getWatchProviders('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/watch/providers'));
    });
  });

  describe('getLists', () => {
    it('hits movie/{id}/lists', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.movies.getLists('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/lists'));
    });
    it('passes the page param when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 2, results: [], totalPages: 2, totalResults: 0 });
      await tmdb.movies.getLists('550', 2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });

  describe('getChanges', () => {
    it('hits movie/{id}/changes', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
      await tmdb.movies.getChanges('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/changes'));
    });
    it('passes startDate, endDate, and page when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
      await tmdb.movies.getChanges('550', '2026-01-01', '2026-02-01', 2);
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/start_date=2026-01-01/));
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/end_date=2026-02-01/));
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/page=2/));
    });
  });

  describe('getAccountStates', () => {
    it('hits movie/{id}/account_states', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, favorite: false, rated: false, watchlist: false });
      await tmdb.movies.getAccountStates('550');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/account_states'));
    });
  });
});
