import { CastMember, CrewMember } from '../../movies/types/MovieCast';

export interface Person {
  adult: boolean;
  alsoKnownAs: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdbId: string | null;
  knownForDepartment: string | null;
  name: string;
  placeOfBirth: string | null;
  popularity: number;
  profilePath: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TvCredits {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    originalName: string;
    character: string;
    creditId: string;
    episodeCount: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    originalName: string;
    department: string;
    job: string;
    creditId: string;
    episodeCount: number;
  }>;
}

export interface CombinedCredits {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    originalName: string;
    character: string;
    creditId: string;
    mediaType: 'movie' | 'tv';
    episodeCount?: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    originalName: string;
    department: string;
    job: string;
    creditId: string;
    mediaType: 'movie' | 'tv';
    episodeCount?: number;
  }>;
}

export interface Profile {
  aspectRatio: number;
  filePath: string;
  height: number;
  iso6391: string | null;
  voteAverage: number;
  voteCount: number;
  width: number;
}

export interface Images {
  id: number;
  profiles: Profile[];
}

export interface ExternalIds {
  externalIds: {
    id: number;
    freebaseMid: string | null;
    freebaseId: string | null;
    imdbId: string | null;
    tvrageId: number | null;
    wikidataId: string | null;
    facebookId: string | null;
    instagramId: string | null;
    twitterId: string | null;
  };
}

export interface TaggedImages {
  taggedImages: {
    id: number;
    page: number;
    results: Array<{
      aspectRatio: number;
      filePath: string;
      height: number;
      id: string;
      iso_639_1: string | null;
      voteAverage: number;
      voteCount: number;
      width: number;
      imageType: string;
      media: {
        id: number;
        mediaType: 'movie' | 'tv';
        title?: string;
        name?: string;
        originalTitle?: string;
        originalName?: string;
      };
    }>;
    totalPages: number;
    totalResults: number;
  };
}

export interface Translations {
  translations: {
    id: number;
    translations: Array<{
      iso_3166_1: string;
      iso_639_1: string;
      name: string;
      englishName: string;
      data: {
        biography: string;
      };
    }>;
  };
}

export interface PopularPeople {
  page: number;
  results: Person[];
  totalPages: number;
  totalResults: number;
}

export interface Options<T extends AppendOptions[]> {
  include?: T;
}

type AppendResponseMap = {
  movieCredits: MovieCredits;
  tvCredits: TvCredits;
  combinedCredits: CombinedCredits;
  images: Images;
  latest: Person;
  externalIds: ExternalIds;
  taggedImages: TaggedImages;
  translations: Translations;
};

export type AppendResponse<T extends AppendOptions[]> = {
  [K in T[number]]: AppendResponseMap[K];
};

export type AppendOptions =
  | 'movieCredits'
  | 'tvCredits'
  | 'combinedCredits'
  | 'images'
  | 'latest'
  | 'externalIds'
  | 'taggedImages'
  | 'translations';
