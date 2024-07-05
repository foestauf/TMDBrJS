interface MovieCredit {
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  votecount: number;
}

interface CastMember extends MovieCredit {
  character: string;
  creditId: string;
  order: number;
}

interface CrewMember extends MovieCredit {
  creditId: string;
  department: string;
  job: string;
  id: number;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}
