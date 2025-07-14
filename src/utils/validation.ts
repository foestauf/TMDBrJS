import { z } from 'zod';

// Base schemas
export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ProductionCompanySchema = z.object({
  id: z.number(),
  logoPath: z.string().nullable(),
  name: z.string(),
  originCountry: z.string(),
});

export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

export const SpokenLanguageSchema = z.object({
  englishName: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

// Movie schemas
export const PopularMovieSchema = z.object({
  adult: z.boolean(),
  backdropPath: z.string().nullable(),
  genreIds: z.array(z.number()),
  id: z.number(),
  originalLanguage: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  popularity: z.number(),
  posterPath: z.string().nullable(),
  releaseDate: z.string(),
  title: z.string(),
  video: z.boolean(),
  voteAverage: z.number(),
  voteCount: z.number(),
});

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdropPath: z.string().nullable(),
  belongsToCollection: z.any().nullable(),
  budget: z.number(),
  genres: z.array(GenreSchema),
  homepage: z.string().nullable(),
  id: z.number(),
  imdbId: z.string().nullable(),
  originalLanguage: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  popularity: z.number(),
  posterPath: z.string().nullable(),
  productionCompanies: z.array(ProductionCompanySchema),
  productionCountries: z.array(ProductionCountrySchema),
  releaseDate: z.string(),
  revenue: z.number(),
  runtime: z.number().nullable(),
  spokenLanguages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  voteAverage: z.number(),
  voteCount: z.number(),
});

// Person schemas
export const PopularPersonSchema = z.object({
  adult: z.boolean(),
  gender: z.number(),
  id: z.number(),
  knownFor: z.array(PopularMovieSchema),
  knownForDepartment: z.string(),
  name: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
});

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
  knownForDepartment: z.string(),
  name: z.string(),
  placeOfBirth: z.string().nullable(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
});

// Cast schemas
export const CastSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  knownForDepartment: z.string(),
  name: z.string(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
  castId: z.number(),
  character: z.string(),
  creditId: z.string(),
  order: z.number(),
});

// Response schemas
export const PopularMoviesSchema = z.object({
  page: z.number(),
  results: z.array(PopularMovieSchema),
  totalPages: z.number(),
  totalResults: z.number(),
});

export const PopularPeopleSchema = z.object({
  page: z.number(),
  results: z.array(PopularPersonSchema),
  totalPages: z.number(),
  totalResults: z.number(),
});

// Validation function
export function validateResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API Response Validation Error:', error.issues);
    }
    throw error;
  }
}
