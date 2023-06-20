export interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface MovieCredits {
  movieCredits: MovieCredits[]; // replace 'any' with the actual type
}

export interface TvCredits {
  tvCredits: any; // replace 'any' with the actual type
}

export interface CombinedCredits {
  combinedCredits: any; // replace 'any' with the actual type
}

export interface Images {
  images: any; // replace 'any' with the actual type
}

export interface TaggedImages {
  taggedImages: any; // replace 'any' with the actual type
}

type IncludeOptionsMap = {
  movieCredits: MovieCredits;
  tvCredits: TvCredits;
  combinedCredits: CombinedCredits;
  images: Images;
  taggedImages: TaggedImages;
};

export type AppendResponse<T extends IncludeOptions[]> = T extends (infer U)[]
  ? U extends keyof IncludeOptionsMap
    ? IncludeOptionsMap[U]
    : never
  : never;

export type IncludeOptions = ['movieCredits' | 'tvCredits' | 'combinedCredits' | 'images' | 'taggedImages'];
