import { vi, describe, it, beforeAll, expect } from 'vitest';
import TmdbClient from '../..';
import { Options } from '../types/MovieCast';

describe('Movies', () => {
  let tmdb: TmdbClient;

  beforeAll(() => {
    tmdb = new TmdbClient({ apiKey: '123' });
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
    });

    it('should throw an error if API call fails', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.movies.getById(movieId)).rejects.toThrow('API error');
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
});
