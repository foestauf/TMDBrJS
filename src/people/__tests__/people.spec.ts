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

  describe('getLatest', () => {
    it('hits person/latest', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 1, name: 'Latest Person' });
      const result = await tmdb.people.getLatest();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/latest'));
      expect(result).toEqual({ id: 1, name: 'Latest Person' });
    });
  });

  describe('getChanges', () => {
    it('hits person/{id}/changes', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
      await tmdb.people.getChanges('287');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/287/changes'));
    });
    it('passes startDate, endDate, and page when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
      await tmdb.people.getChanges('287', '2026-01-01', '2026-02-01', 2);
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('start_date=2026-01-01');
      expect(calledWith).toContain('end_date=2026-02-01');
      expect(calledWith).toContain('page=2');
    });
  });
});
