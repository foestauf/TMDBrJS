import { Client } from '../../index';
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
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId, options);

      expect(result).toEqual(response);
      // Verify that the URL was constructed correctly with snake_case
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('append_to_response=movie_credits'));
    });

    it('should convert multiple camelCase append options to snake_case', async () => {
      const personId = '123';
      const options: Options<['movieCredits', 'tvCredits', 'combinedCredits', 'images']> = {
        include: ['movieCredits', 'tvCredits', 'combinedCredits', 'images'],
      };
      const response = {
        id: personId,
        name: 'John Doe',
        movieCredits: { cast: [] },
        tvCredits: { cast: [] },
        combinedCredits: { cast: [] },
        images: { profiles: [] },
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId, options);

      expect(result).toEqual(response);
      // Verify that the URL was constructed correctly with snake_case
      // URL encoding converts commas to %2C
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(
        expect.stringMatching(/append_to_response=movie_credits(%2C|,)tv_credits(%2C|,)combined_credits(%2C|,)images/),
      );
    });

    it('should throw an error if API call fails', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.people.getById(personId)).rejects.toThrow('API error');
    });
  });
});
