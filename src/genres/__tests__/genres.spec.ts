import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Genres', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('movies', () => {
    it('hits genre/movie/list', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ genres: [{ id: 28, name: 'Action' }] });
      const result = await tmdb.genres.movies();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('genre/movie/list'));
      expect(result.genres[0]).toEqual({ id: 28, name: 'Action' });
    });
  });

  describe('tv', () => {
    it('hits genre/tv/list', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ genres: [{ id: 18, name: 'Drama' }] });
      const result = await tmdb.genres.tv();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('genre/tv/list'));
      expect(result.genres[0]).toEqual({ id: 18, name: 'Drama' });
    });
  });
});
