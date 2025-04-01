import { z } from 'zod';

// Base schemas
export const GenreSchema = z.object({
  id: z.number(),
  name: z.string()
});

export const ProductionCompanySchema = z.object({
  id: z.number(),
  logoPath: z.string(),
  name: z.string(),
  originCountry: z.string()
});

export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string()
});

export const SpokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string()
});

// Movie schemas
export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  belongsToCollection: z.string(),
  budget: z.number(),
  genres: z.array(GenreSchema),
  homepage: z.string(),
  id: z.number(),
  imdbId: z.string(),
  originalLanguage: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  popularity: z.number(),
  posterPath: z.string(),
  productionCompanies: z.array(ProductionCompanySchema),
  productionCountries: z.array(ProductionCountrySchema),
  releaseDate: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spokenLanguages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  voteAverage: z.number(),
  voteCount: z.number()
});

// Person schemas
export const PersonSchema = z.object({
  adult: z.boolean(),
  alsoKnownAs: z.array(z.string()),
  biography: z.string(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  gender: z.number(),
  homepage: z.string().nullable(),
  id: z.number(),
  imdbId: z.string().nullable(),
  knownForDepartment: z.string().nullable(),
  name: z.string(),
  placeOfBirth: z.string().nullable(),
  popularity: z.number(),
  profilePath: z.string().nullable()
});

// Response schemas
export const PopularMoviesSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  totalPages: z.number(),
  totalResults: z.number()
});

export const PopularPeopleSchema = z.object({
  page: z.number(),
  results: z.array(PersonSchema),
  totalPages: z.number(),
  totalResults: z.number()
});

// Validation function
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API Response Validation Error:', error.errors);
    }
    throw error;
  }
} 