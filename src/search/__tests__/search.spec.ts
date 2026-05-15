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
});
