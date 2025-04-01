import { Client } from '../..';
import { Options } from '../types/Person';
import { vi, expect, describe, beforeAll, it, beforeEach } from 'vitest';

describe('People', () => {
  let tmdb: Client;

  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  beforeEach(() => {
    vi.restoreAllMocks();
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
        movieCredits: {
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
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response),
      } as Response);

      const result = await tmdb.people.getById(personId, options);
      const url = new URL(`https://api.themoviedb.org/3/person/${personId}`);
      url.searchParams.append('append_to_response', 'movieCredits');
      url.searchParams.append('language', 'en-US');

      expect(result).toEqual(response);
      expect(fetchSpy).toHaveBeenCalledWith(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 123',
        },
      });
    });

    it('should throw an error if API call fails', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.people.getById(personId)).rejects.toThrow('API error');
    });
  });
});
