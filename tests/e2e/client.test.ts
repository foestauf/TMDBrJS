import { describe, it, expect, beforeAll } from 'vitest';
import { Client } from '../../src/index';
import dotenv from 'dotenv';
import {
  MovieSchema,
  PersonSchema,
  PopularMovieSchema,
  PopularPeopleSchema,
  PopularPersonSchema,
} from '../../src/utils/validation';

// Load test environment variables
dotenv.config({ path: '.env.test' });

describe('TMDB Client E2E Tests', () => {
  let client: Client;

  beforeAll(() => {
    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is required for e2e tests');
    }
    client = new Client({
      apiKey: process.env.TMDB_API_KEY,
    });
  });

  describe('Movies API', () => {
    it('should fetch popular movies', async () => {
      const response = await client.movies.getPopular();
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);

      // Validate first movie against schema
      const validationResult = PopularMovieSchema.safeParse(response.results[0]);
      if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error);
      }
      expect(validationResult.success).toBe(true);
    });

    it('should fetch movie details', async () => {
      // Using a well-known movie ID (The Matrix)
      const movieId = '603';
      const response = await client.movies.getById(movieId);

      // Validate against schema
      const validationResult = MovieSchema.safeParse(response);
      if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error);
      }
      expect(validationResult.success).toBe(true);

      // Check specific fields
      expect(response.id).toBe(Number(movieId));
      expect(response.title).toBe('The Matrix');
    });

    it('should fetch movie credits', async () => {
      const movieId = '603';
      const response = await client.movies.getCredits(movieId);

      expect(response).toBeDefined();
      expect(response.cast).toBeInstanceOf(Array);
      expect(response.crew).toBeInstanceOf(Array);

      // Validate first cast member
      if (response.cast.length > 0) {
        const castMember = response.cast[0];
        expect(castMember).toHaveProperty('id');
        expect(castMember).toHaveProperty('name');
        expect(castMember).toHaveProperty('character');
      }
    });
  });

  describe('People API', () => {
    it('should fetch popular people', async () => {
      const response = await client.people.getPopular();
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);

      // First validate the response structure
      expect(response).toHaveProperty('page');
      expect(response).toHaveProperty('totalPages');
      expect(response).toHaveProperty('totalResults');
      expect(response).toHaveProperty('results');

      // Then validate the first person in results
      const validationResult = PopularPersonSchema.safeParse(response.results[0]);
      if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error);
      }
      expect(validationResult.success).toBe(true);
    });

    it('should fetch person details', async () => {
      // Using a well-known actor ID (Keanu Reeves)
      const personId = '6384';
      const response = await client.people.getById(personId);

      // Validate against schema
      const validationResult = PersonSchema.safeParse(response);
      if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error);
      }
      expect(validationResult.success).toBe(true);

      // Check specific fields
      expect(response.id).toBe(Number(personId));
      expect(response.name).toBe('Keanu Reeves');
    });

    it('should fetch person movie credits', async () => {
      const personId = '6384';
      const response = await client.people.getMovieCredits(personId);

      expect(response).toBeDefined();
      expect(response.cast).toBeInstanceOf(Array);
      expect(response.crew).toBeInstanceOf(Array);

      // Check for known movies
      const matrixMovie = response.cast.find((movie) => movie.id === 603);
      expect(matrixMovie).toBeDefined();
      expect(matrixMovie?.title).toBe('The Matrix');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid API key', async () => {
      const invalidClient = new Client({
        apiKey: 'invalid_key',
      });

      await expect(invalidClient.movies.getPopular()).rejects.toThrow('Invalid API key');
    });

    it('should handle non-existent resource', async () => {
      // Using a very large ID that's unlikely to exist
      await expect(client.movies.getById('9999999999')).rejects.toThrow('Resource not found');
    });
  });
});
