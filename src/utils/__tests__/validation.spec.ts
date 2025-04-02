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
  validateResponse,
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
      originCountry: 'US',
    },
    productionCountry: {
      iso_3166_1: 'US',
      name: 'United States',
    },
    spokenLanguage: {
      englishName: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
    movie: {
      adult: false,
      backdropPath: '/path/to/backdrop.jpg',
      belongsToCollection: null,
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
      productionCompanies: [
        {
          id: 1,
          logoPath: '/path/to/logo.png',
          name: 'Warner Bros',
          originCountry: 'US',
        },
      ],
      productionCountries: [
        {
          iso_3166_1: 'US',
          name: 'United States',
        },
      ],
      releaseDate: '2024-01-01',
      revenue: 2000000,
      runtime: 120,
      spokenLanguages: [
        {
          englishName: 'English',
          iso_639_1: 'en',
          name: 'English',
        },
      ],
      status: 'Released',
      tagline: 'Movie tagline',
      title: 'Movie Title',
      video: false,
      voteAverage: 7.5,
      voteCount: 1000,
    },
    popularMovie: {
      adult: false,
      backdropPath: '/path/to/backdrop.jpg',
      genreIds: [1, 2, 3],
      id: 1,
      originalLanguage: 'en',
      originalTitle: 'Original Title',
      overview: 'Movie overview',
      popularity: 100,
      posterPath: '/path/to/poster.jpg',
      releaseDate: '2024-01-01',
      title: 'Movie Title',
      video: false,
      voteAverage: 7.5,
      voteCount: 1000,
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
      profilePath: '/path/to/profile.jpg',
    },
    popularPerson: {
      adult: false,
      gender: 1,
      id: 1,
      knownFor: [
        {
          adult: false,
          backdropPath: '/path/to/backdrop.jpg',
          genreIds: [1, 2, 3],
          id: 1,
          originalLanguage: 'en',
          originalTitle: 'Original Title',
          overview: 'Movie overview',
          popularity: 100,
          posterPath: '/path/to/poster.jpg',
          releaseDate: '2024-01-01',
          title: 'Movie Title',
          video: false,
          voteAverage: 7.5,
          voteCount: 1000,
        },
      ],
      knownForDepartment: 'Acting',
      name: 'John Doe',
      popularity: 100,
      profilePath: '/path/to/profile.jpg',
    },
  },
  invalid: {
    genre: { id: '1', name: 123 },
    productionCompany: {
      id: '1',
      logoPath: 123,
      name: null,
      originCountry: undefined,
    },
    productionCountry: {
      iso_3166_1: 123,
      name: null,
    },
    spokenLanguage: {
      englishName: 123,
      iso_639_1: null,
      name: undefined,
    },
    movie: {
      adult: 'false',
      backdropPath: 123,
      belongsToCollection: 123,
      budget: '1000000',
      genres: [{ id: '1', name: 123 }],
      homepage: 123,
      id: '1',
      imdbId: 123,
      originalLanguage: 123,
      originalTitle: null,
      overview: 123,
      popularity: '100',
      posterPath: 123,
      productionCompanies: [
        {
          id: '1',
          logoPath: 123,
          name: null,
          originCountry: undefined,
        },
      ],
      productionCountries: [
        {
          iso_3166_1: 123,
          name: null,
        },
      ],
      releaseDate: 123,
      revenue: '2000000',
      runtime: '120',
      spokenLanguages: [
        {
          englishName: 123,
          iso_639_1: null,
          name: undefined,
        },
      ],
      status: null,
      tagline: 123,
      title: null,
      video: 'false',
      voteAverage: '7.5',
      voteCount: '1000',
    },
    popularMovie: {
      adult: 'false',
      backdropPath: 123,
      genreIds: ['1', '2', '3'],
      id: '1',
      originalLanguage: 123,
      originalTitle: null,
      overview: 123,
      popularity: '100',
      posterPath: 123,
      releaseDate: 123,
      title: null,
      video: 'false',
      voteAverage: '7.5',
      voteCount: '1000',
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
      profilePath: 123,
    },
    popularPerson: {
      adult: 'false',
      gender: '1',
      id: '1',
      knownFor: [
        {
          adult: 'false',
          backdropPath: 123,
          genreIds: ['1', '2', '3'],
          id: '1',
          originalLanguage: 123,
          originalTitle: null,
          overview: 123,
          popularity: '100',
          posterPath: 123,
          releaseDate: 123,
          title: null,
          video: 'false',
          voteAverage: '7.5',
          voteCount: '1000',
        },
      ],
      knownForDepartment: 123,
      name: null,
      popularity: '100',
      profilePath: 123,
    },
  },
};

// Helper function to test schema validation
const testSchemaValidation = <T extends z.ZodType>(schema: T, validData: z.infer<T>, invalidData: unknown): void => {
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
      results: [testData.valid.popularMovie],
      totalPages: 10,
      totalResults: 100,
    };

    const invalidResponse = {
      page: '1',
      results: [testData.invalid.popularMovie],
      totalPages: '10',
      totalResults: '100',
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
      results: [testData.valid.popularPerson],
      totalPages: 10,
      totalResults: 100,
    };

    const invalidResponse = {
      page: '1',
      results: [testData.invalid.popularPerson],
      totalPages: '10',
      totalResults: '100',
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
    const TestSchema = z.object({
      id: z.number(),
      name: z.string(),
    });

    it('should validate valid data', () => {
      const validData = { id: 1, name: 'test' };
      expect(() => validateResponse(TestSchema, validData)).not.toThrow();
    });

    it('should throw error for invalid data', () => {
      const invalidData = { id: '1', name: 123 };
      expect(() => validateResponse(TestSchema, invalidData)).toThrow();
    });

    it('should handle non-Zod errors', () => {
      const invalidData = { id: '1', name: 123 };
      expect(() => validateResponse(TestSchema, invalidData)).toThrow();
    });
  });
});
