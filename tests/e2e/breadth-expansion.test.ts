import { describe, it, expect, beforeAll } from 'vitest';
import { Client } from '../../src/index';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Breadth Expansion E2E', () => {
  let client: Client;

  beforeAll(() => {
    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is required for e2e tests');
    }
    client = new Client({ apiKey: process.env.TMDB_API_KEY });
  });

  describe('search.multi', () => {
    it('returns results for a known query', async () => {
      const response = await client.search.multi('Dune');
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('discover.movies', () => {
    it('returns results when sorted by popularity', async () => {
      const response = await client.discover.movies({ sortBy: 'popularity.desc' });
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('trending.all', () => {
    it('returns daily trending content', async () => {
      const response = await client.trending.all('day');
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('configuration.details', () => {
    it('returns image base urls', async () => {
      const response = await client.configuration.details();
      expect(typeof response.images.secureBaseUrl).toBe('string');
      expect(response.images.secureBaseUrl.length).toBeGreaterThan(0);
      expect(response.images.posterSizes).toBeInstanceOf(Array);
    });
  });
});
