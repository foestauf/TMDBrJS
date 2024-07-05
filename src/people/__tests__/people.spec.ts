import TmdbClient from '../..';
import { Options } from '../types/Person';
import { vi, expect, describe, beforeAll, it } from 'vitest';

describe('People', () => {
  let tmdb: TmdbClient;

  beforeAll(() => {
    tmdb = new TmdbClient({ apiKey: '123' });
  });

  describe('getById', () => {
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
      const options: Options<['movieCredits']> = {
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

    it('should throw an error if API call fails', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.people.getById(personId)).rejects.toThrow('API error');
    });
  });
});
