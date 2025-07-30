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
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(`movie/${movieId}`);
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
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(`movie/${movieId}/credits`);
    });
  });
});
