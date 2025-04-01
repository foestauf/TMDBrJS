import { describe, it, expect } from 'vitest';
import {
  GenreSchema,
  ProductionCompanySchema,
  ProductionCountrySchema,
  SpokenLanguageSchema,
  MovieSchema,
  PersonSchema,
  PopularMoviesSchema,
  PopularPeopleSchema,
  validateResponse
} from '../validation';
import { z } from 'zod';

// Common test data
const testData = {
  valid: {
    genre: { id: 1, name: 'Action' },
    productionCompany: {
      id: 1,
      logoPath: '/path/to/logo.png',
      name: 'Warner Bros',
      originCountry: 'US'
    },
    productionCountry: {
      iso_3166_1: 'US',
      name: 'United States'
    },
    spokenLanguage: {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English'
    },
    movie: {
      adult: false,
      backdrop_path: '/path/to/backdrop.jpg',
      belongsToCollection: 'Collection Name',
      budget: 1000000,
      genres: [{ id: 1, name: 'Action' }],
      homepage: 'https://example.com',
      id: 1,
      imdbId: 'tt1234567',
      originalLanguage: 'en',
      originalTitle: 'Original Title',
      overview: 'Movie overview',
      popularity: 100,
      posterPath: '/path/to/poster.jpg',
      productionCompanies: [{
        id: 1,
        logoPath: '/path/to/logo.png',
        name: 'Warner Bros',
        originCountry: 'US'
      }],
      productionCountries: [{
        iso_3166_1: 'US',
        name: 'United States'
      }],
      releaseDate: '2024-01-01',
      revenue: 2000000,
      runtime: 120,
      spokenLanguages: [{
        english_name: 'English',
        iso_639_1: 'en',
        name: 'English'
      }],
      status: 'Released',
      tagline: 'Movie tagline',
      title: 'Movie Title',
      video: false,
      voteAverage: 7.5,
      voteCount: 1000
    },
    person: {
      adult: false,
      alsoKnownAs: ['John Doe'],
      biography: 'Actor biography',
      birthday: '1990-01-01',
      deathday: null,
      gender: 1,
      homepage: null,
      id: 1,
      imdbId: null,
      knownForDepartment: 'Acting',
      name: 'John Doe',
      placeOfBirth: 'New York',
      popularity: 100,
      profilePath: '/path/to/profile.jpg'
    }
  },
  invalid: {
    genre: { id: '1', name: 123 },
    productionCompany: {
      id: '1',
      logoPath: 123,
      name: null,
      originCountry: undefined
    },
    productionCountry: {
      iso_3166_1: 123,
      name: null
    },
    spokenLanguage: {
      english_name: 123,
      iso_639_1: null,
      name: undefined
    },
    movie: {
      adult: 'false',
      backdrop_path: 123,
      belongsToCollection: null,
      budget: '1000000',
      genres: [{ id: '1', name: 123 }],
      homepage: null,
      id: '1',
      imdbId: null,
      originalLanguage: 123,
      originalTitle: null,
      overview: 123,
      popularity: '100',
      posterPath: null,
      productionCompanies: [{
        id: '1',
        logoPath: 123,
        name: null,
        originCountry: undefined
      }],
      productionCountries: [{
        iso_3166_1: 123,
        name: null
      }],
      releaseDate: null,
      revenue: '2000000',
      runtime: '120',
      spokenLanguages: [{
        english_name: 123,
        iso_639_1: null,
        name: undefined
      }],
      status: null,
      tagline: null,
      title: null,
      video: 'false',
      voteAverage: '7.5',
      voteCount: '1000'
    },
    person: {
      adult: 'false',
      alsoKnownAs: [123],
      biography: null,
      birthday: 123,
      deathday: 123,
      gender: '1',
      homepage: 123,
      id: '1',
      imdbId: 123,
      knownForDepartment: 123,
      name: null,
      placeOfBirth: 123,
      popularity: '100',
      profilePath: 123
    }
  }
};

// Helper function to test schema validation
const testSchemaValidation = <T extends z.ZodType>(
  schema: T,
  validData: z.infer<T>,
  invalidData: unknown
): void => {
  it('should validate valid data', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid data', () => {
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
};

describe('Validation Utils', () => {
  describe('GenreSchema', () => {
    testSchemaValidation(GenreSchema, testData.valid.genre, testData.invalid.genre);
  });

  describe('ProductionCompanySchema', () => {
    testSchemaValidation(ProductionCompanySchema, testData.valid.productionCompany, testData.invalid.productionCompany);
  });

  describe('ProductionCountrySchema', () => {
    testSchemaValidation(ProductionCountrySchema, testData.valid.productionCountry, testData.invalid.productionCountry);
  });

  describe('SpokenLanguageSchema', () => {
    testSchemaValidation(SpokenLanguageSchema, testData.valid.spokenLanguage, testData.invalid.spokenLanguage);
  });

  describe('MovieSchema', () => {
    testSchemaValidation(MovieSchema, testData.valid.movie, testData.invalid.movie);
  });

  describe('PersonSchema', () => {
    testSchemaValidation(PersonSchema, testData.valid.person, testData.invalid.person);
  });

  describe('PopularMoviesSchema', () => {
    const validResponse = {
      page: 1,
      results: [testData.valid.movie],
      totalPages: 10,
      totalResults: 100
    };

    const invalidResponse = {
      page: '1',
      results: [testData.invalid.movie],
      totalPages: '10',
      totalResults: '100'
    };

    it('should validate valid paginated response', () => {
      const result = PopularMoviesSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject invalid paginated response', () => {
      const result = PopularMoviesSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('PopularPeopleSchema', () => {
    const validResponse = {
      page: 1,
      results: [testData.valid.person],
      totalPages: 10,
      totalResults: 100
    };

    const invalidResponse = {
      page: '1',
      results: [testData.invalid.person],
      totalPages: '10',
      totalResults: '100'
    };

    it('should validate valid paginated response', () => {
      const result = PopularPeopleSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject invalid paginated response', () => {
      const result = PopularPeopleSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('validateResponse', () => {
    it('should validate and return valid data', () => {
      const result = validateResponse(GenreSchema, testData.valid.genre);
      expect(result).toEqual(testData.valid.genre);
    });

    it('should throw error for invalid data', () => {
      expect(() => validateResponse(GenreSchema, testData.invalid.genre)).toThrow();
    });

    it('should handle non-Zod errors', () => {
      expect(() => validateResponse(GenreSchema, testData.invalid.genre)).toThrow();
    });
  });
}); 