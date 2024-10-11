import TmdbClient from '..';

import { vi, expect, describe, beforeAll, it } from 'vitest';
import { Options as MovieOptions } from '../movies/types/MovieCast';
import { Options as PersonOptions } from '../people/types/Person';

describe('TmdbClient', () => {
  let tmdb: TmdbClient;

  beforeAll(() => {
    tmdb = new TmdbClient({ apiKey: '123' });
  });

  describe('movies', () => {
    it('should return a movie object', async () => {
      const movieId = '123';
      const response = {
        id: movieId,
        title: 'Movie 1',
        release_date: '2022-01-01',
        overview: 'Lorem ipsum dolor sit amet',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId);

      expect(result).toEqual(response);
    });

    it('should append response with options', async () => {
      const movieId = '123';
      const options: MovieOptions<['credits']> = {
        include: ['credits'],
      };
      const response = {
        id: movieId,
        title: 'Movie 1',
        credits: {
          cast: [
            {
              id: 1,
              name: 'John Doe',
            },
            {
              id: 2,
              name: 'Jane Smith',
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

  describe('people', () => {
    it('should return a person object', async () => {
      const personId = '123';
      const response = {
        id: personId,
        name: 'John Doe',
        birthday: '1990-01-01',
        known_for_department: 'Acting',
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId);

      expect(result).toEqual(response);
    });

    it('should append response with options', async () => {
      const personId = '123';
      const options: PersonOptions<['movieCredits']> = {
        include: ['movieCredits'],
      };
      const response = {
        id: personId,
        name: 'John Doe',
        movie_credits: {
          cast: [
            {
              id: 1,
              title: 'Movie 1',
            },
            {
              id: 2,
              title: 'Movie 2',
            },
          ],
        },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId, options);

      expect(result).toEqual(response);
    });

    it('should return a persons movies credits', async () => {
      const personId = '123';
      const response = {
        id: personId,
        cast: [
          {
            id: 1,
            title: 'Movie 1',
          },
          {
            id: 2,
            title: 'Movie 2',
          },
        ],
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getMovieCredits(personId);

      expect(result).toEqual(response);
    });

    it('should throw an error if API call fails', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.people.getById(personId)).rejects.toThrow('API error');
    });

    it('should throw an error if no API key is provided', async () => {
      const client = new TmdbClient({ apiKey: '' });
      const personId = '123';

      await expect(client.people.getById(personId)).rejects.toThrow('No API key provided');
    });
  });
});
