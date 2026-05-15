import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Trending', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  it('all(day) hits trending/all/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.all('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/all/day'));
  });

  it('all(week) hits trending/all/week', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.all('week');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/all/week'));
  });

  it('movies(day) hits trending/movie/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.movies('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/movie/day'));
  });

  it('tv(week) hits trending/tv/week', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.tv('week');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/tv/week'));
  });

  it('people(day) hits trending/person/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.people('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/person/day'));
  });
});
