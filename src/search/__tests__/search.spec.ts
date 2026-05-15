import { vi, describe, it, beforeAll, beforeEach, expect } from 'vitest';
import { Client } from '../..';

describe('Search', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('multi', () => {
    it('hits search/multi with the query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.multi('Dune');
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('search/multi');
      expect(calledWith).toContain('query=Dune');
    });

    it('passes page and includeAdult when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 2, results: [], totalPages: 5, totalResults: 100 });
      await tmdb.search.multi('Star Wars', { page: 2, includeAdult: true });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('query=Star+Wars');
      expect(calledWith).toContain('page=2');
      expect(calledWith).toContain('include_adult=true');
    });
  });

  describe('movies', () => {
    it('hits search/movie with movie-specific options', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.movies('Dune', { year: 2024, primaryReleaseYear: 2024, region: 'US' });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('search/movie');
      expect(calledWith).toContain('query=Dune');
      expect(calledWith).toContain('year=2024');
      expect(calledWith).toContain('primary_release_year=2024');
      expect(calledWith).toContain('region=US');
    });
  });

  describe('tv', () => {
    it('hits search/tv with firstAirDateYear', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.tv('The Office', { firstAirDateYear: 2005 });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('search/tv');
      expect(calledWith).toContain('first_air_date_year=2005');
    });
  });

  describe('people', () => {
    it('hits search/person', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.people('Tilda Swinton');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/person'));
    });
  });

  describe('keywords', () => {
    it('hits search/keyword', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.keywords('dystopia');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/keyword'));
    });
  });

  describe('companies', () => {
    it('hits search/company', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.companies('A24');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/company'));
    });
  });

  describe('collections', () => {
    it('hits search/collection', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.collections('Bond');
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/collection'));
    });
  });
});
