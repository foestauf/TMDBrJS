import { vi, expect, describe, beforeAll, it } from 'vitest';
import {
  Options as MovieOptions,
  Movie,
  MovieCredits,
  PopularMovies,
  Reviews,
  SimilarMovies,
  Videos,
  Images as MovieImages,
} from '../movies/types/MovieCast';
import {
  Options as PersonOptions,
  Person,
  TvCredits,
  CombinedCredits,
  Images as PersonImages,
  PopularPeople,
} from '../people/types/Person';
import { Client } from '..';

describe('Client', () => {
  let tmdb: Client;

  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('movies', () => {
    const mockMovie: Movie = {
      adult: false,
      backdrop_path: '/path/to/backdrop.jpg',
      belongsToCollection: 'Collection Name',
      budget: 1000000,
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ],
      homepage: 'https://example.com',
      id: 123,
      imdbId: 'tt1234567',
      originalLanguage: 'en',
      originalTitle: 'Original Movie Title',
      overview: 'Movie overview',
      popularity: 7.5,
      posterPath: '/path/to/poster.jpg',
      productionCompanies: [
        {
          id: 1,
          logoPath: '/path/to/logo.png',
          name: 'Production Company',
          originCountry: 'US',
        },
      ],
      productionCountries: [
        {
          iso_3166_1: 'US',
          name: 'United States',
        },
      ],
      releaseDate: '2022-01-01',
      revenue: 2000000,
      runtime: 120,
      spokenLanguages: [
        {
          english_name: 'English',
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
    };

    const mockMovieCredits: MovieCredits = {
      id: 123,
      cast: [
        {
          adult: false,
          alsoKnownAs: [],
          biography: '',
          birthday: null,
          deathday: null,
          gender: 1,
          homepage: null,
          id: 1,
          imdbId: null,
          knownForDepartment: 'Acting',
          name: 'Actor Name',
          placeOfBirth: null,
          popularity: 0,
          profilePath: null,
          cast_id: 1,
          character: 'Character Name',
          creditId: 'credit1',
          order: 1,
        },
      ],
      crew: [
        {
          adult: false,
          alsoKnownAs: [],
          biography: '',
          birthday: null,
          deathday: null,
          gender: 1,
          homepage: null,
          id: 2,
          imdbId: null,
          knownForDepartment: 'Directing',
          name: 'Director Name',
          placeOfBirth: null,
          popularity: 0,
          profilePath: null,
          creditId: 'credit2',
          department: 'Directing',
          job: 'Director',
        },
      ],
    };

    const mockReviews: Reviews = {
      reviews: {
        id: 123,
        page: 1,
        results: [
          {
            id: 'review1',
            author: 'Reviewer Name',
            content: 'Review content',
            createdAt: '2022-01-01',
            url: 'https://example.com/review',
          },
        ],
        totalPages: 1,
        totalResults: 1,
      },
    };

    const mockSimilarMovies: SimilarMovies = {
      similarMovies: {
        id: 123,
        page: 1,
        results: [mockMovie],
        totalPages: 1,
        totalResults: 1,
      },
    };

    const mockVideos: Videos = {
      videos: {
        id: 123,
        results: [
          {
            id: 'video1',
            key: 'video_key',
            name: 'Video Name',
            site: 'YouTube',
            size: 1080,
            type: 'Trailer',
          },
        ],
      },
    };

    const mockMovieImages: MovieImages = {
      images: {
        id: 123,
        backdrops: [
          {
            aspectRatio: 1.777,
            filePath: '/path/to/backdrop.jpg',
            height: 1080,
            iso6391: null,
            voteAverage: 7.5,
            voteCount: 100,
            width: 1920,
          },
        ],
        posters: [
          {
            aspectRatio: 0.666,
            filePath: '/path/to/poster.jpg',
            height: 1500,
            iso6391: null,
            voteAverage: 7.5,
            voteCount: 100,
            width: 1000,
          },
        ],
      },
    };

    const mockPopularMovies: PopularMovies = {
      page: 1,
      results: [mockMovie],
      totalPages: 1,
      totalResults: 1,
    };

    it('should return popular movies', async () => {
      const response = mockPopularMovies;
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getPopular();

      expect(result).toEqual(response);
    });

    it('should return a movie object', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockMovie);

      const result = await tmdb.movies.getById(movieId);

      expect(result).toEqual(mockMovie);
    });

    it('should append response with credits', async () => {
      const movieId = '123';
      const options: MovieOptions<['credits']> = {
        include: ['credits'],
      };
      const response = {
        ...mockMovie,
        credits: mockMovieCredits,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId, options);

      expect(result).toEqual(response);
    });

    it('should append response with multiple options', async () => {
      const movieId = '123';
      const options: MovieOptions<['credits', 'reviews', 'similar', 'videos', 'images']> = {
        include: ['credits', 'reviews', 'similar', 'videos', 'images'],
      };
      const response = {
        ...mockMovie,
        credits: mockMovieCredits,
        reviews: mockReviews,
        similar: mockSimilarMovies,
        videos: mockVideos,
        images: mockMovieImages,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.movies.getById(movieId, options);

      expect(result).toEqual(response);
    });

    it('should return movie credits', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockMovieCredits);

      const result = await tmdb.movies.getCredits(movieId);

      expect(result).toEqual(mockMovieCredits);
    });

    it('should return similar movies', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockSimilarMovies);

      const result = await tmdb.movies.getSimilar(movieId);

      expect(result).toEqual(mockSimilarMovies);
    });

    it('should throw an error if API call fails', async () => {
      const movieId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.movies.getById(movieId)).rejects.toThrow('API error');
    });

    it('should throw an error if no API key is provided', async () => {
      const client = new Client({ apiKey: '' });
      const movieId = '123';

      await expect(client.movies.getById(movieId)).rejects.toThrow('No API key provided');
    });
  });

  describe('people', () => {
    const mockPerson: Person = {
      adult: false,
      alsoKnownAs: ['Johnny'],
      biography: 'A great actor',
      birthday: '1990-01-01',
      deathday: null,
      gender: 1,
      homepage: null,
      id: 123,
      imdbId: 'nm123456',
      knownForDepartment: 'Acting',
      name: 'John Doe',
      placeOfBirth: 'New York',
      popularity: 7.5,
      profilePath: '/path/to/profile.jpg',
    };

    const mockMovieCredits: MovieCredits = {
      id: 123,
      cast: [
        {
          ...mockPerson,
          cast_id: 1,
          character: 'Lead Role',
          creditId: 'credit1',
          order: 1,
          knownForDepartment: 'Acting',
        },
      ],
      crew: [
        {
          ...mockPerson,
          creditId: 'credit2',
          department: 'Directing',
          job: 'Director',
        },
      ],
    };

    const mockTvCredits: TvCredits = {
      id: 123,
      cast: [
        {
          id: 1,
          name: 'TV Show 1',
          originalName: 'Original TV Show 1',
          character: 'Lead Role',
          creditId: 'credit1',
          episodeCount: 10,
        },
      ],
      crew: [
        {
          id: 2,
          name: 'TV Show 2',
          originalName: 'Original TV Show 2',
          department: 'Directing',
          job: 'Director',
          creditId: 'credit2',
          episodeCount: 5,
        },
      ],
    };

    const mockCombinedCredits: CombinedCredits = {
      id: 123,
      cast: [
        {
          id: 1,
          name: 'Movie 1',
          originalName: 'Original Movie 1',
          character: 'Lead Role',
          creditId: 'credit1',
          mediaType: 'movie',
        },
        {
          id: 2,
          name: 'TV Show 1',
          originalName: 'Original TV Show 1',
          character: 'Lead Role',
          creditId: 'credit2',
          mediaType: 'tv',
          episodeCount: 10,
        },
      ],
      crew: [
        {
          id: 3,
          name: 'Movie 2',
          originalName: 'Original Movie 2',
          department: 'Directing',
          job: 'Director',
          creditId: 'credit3',
          mediaType: 'movie',
        },
      ],
    };

    const mockPersonImages: PersonImages = {
      id: 123,
      profiles: [
        {
          aspectRatio: 0.666,
          filePath: '/path/to/image.jpg',
          height: 1000,
          iso6391: null,
          voteAverage: 7.5,
          voteCount: 100,
          width: 667,
        },
      ],
    };

    const mockPopularPeople: PopularPeople = {
      page: 1,
      results: [mockPerson],
      totalPages: 1,
      totalResults: 1,
    };

    it('should return popular people', async () => {
      const response = mockPopularPeople;
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getPopular();

      expect(result).toEqual(response);
    });

    it('should return a person object', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockPerson);

      const result = await tmdb.people.getById(personId);

      expect(result).toEqual(mockPerson);
    });

    it('should append response with movie credits', async () => {
      const personId = '123';
      const options: PersonOptions<['movieCredits']> = {
        include: ['movieCredits'],
      };
      const response = {
        ...mockPerson,
        movieCredits: mockMovieCredits,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId, options);

      expect(result).toEqual(response);
    });

    it('should append response with multiple options', async () => {
      const personId = '123';
      const options: PersonOptions<['movieCredits', 'tvCredits', 'images']> = {
        include: ['movieCredits', 'tvCredits', 'images'],
      };
      const response = {
        ...mockPerson,
        movieCredits: mockMovieCredits,
        tvCredits: mockTvCredits,
        images: mockPersonImages,
      };
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response);

      const result = await tmdb.people.getById(personId, options);

      expect(result).toEqual(response);
    });

    it("should return a person's movie credits", async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockMovieCredits);

      const result = await tmdb.people.getMovieCredits(personId);

      expect(result).toEqual(mockMovieCredits);
    });

    it("should return a person's TV credits", async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockTvCredits);

      const result = await tmdb.people.getTvCredits(personId);

      expect(result).toEqual(mockTvCredits);
    });

    it("should return a person's combined credits", async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockCombinedCredits);

      const result = await tmdb.people.getCombinedCredits(personId);

      expect(result).toEqual(mockCombinedCredits);
    });

    it("should return a person's images", async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(mockPersonImages);

      const result = await tmdb.people.getImages(personId);

      expect(result).toEqual(mockPersonImages);
    });

    it('should throw an error if API call fails', async () => {
      const personId = '123';
      vi.spyOn(tmdb.apiClient, 'get').mockRejectedValue(new Error('API error'));

      await expect(tmdb.people.getById(personId)).rejects.toThrow('API error');
    });

    it('should throw an error if no API key is provided', async () => {
      const client = new Client({ apiKey: '' });
      const personId = '123';

      await expect(client.people.getById(personId)).rejects.toThrow('No API key provided');
    });
  });
});
