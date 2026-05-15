import { vi, describe, it, beforeAll, beforeEach, expect } from 'vitest';
import { Client } from '../..';

describe('Discover', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('movies', () => {
    it('hits discover/movie with no query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.movies();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('discover/movie'));
    });

    it('serializes a typed query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.movies({
        sortBy: 'popularity.desc',
        withGenres: [28, 12],
        primaryReleaseYear: 2026,
        voteAverageGte: 7,
        page: 2,
      });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('sort_by=popularity.desc');
      expect(calledWith).toContain('with_genres=28%2C12');
      expect(calledWith).toContain('primary_release_year=2026');
      expect(calledWith).toContain('vote_average_gte=7');
      expect(calledWith).toContain('page=2');
    });
  });

  describe('tv', () => {
    it('hits discover/tv with no query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.tv();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('discover/tv'));
    });

    it('serializes a TV-specific query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.tv({
        sortBy: 'first_air_date.desc',
        withNetworks: [213],
        firstAirDateYear: 2025,
        includeNullFirstAirDates: false,
      });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('sort_by=first_air_date.desc');
      expect(calledWith).toContain('with_networks=213');
      expect(calledWith).toContain('first_air_date_year=2025');
      expect(calledWith).toContain('include_null_first_air_dates=false');
    });
  });
});
