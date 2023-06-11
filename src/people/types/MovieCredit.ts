interface MovieCredit {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface CastMember extends MovieCredit {
  character: string;
  credit_id: string;
  order: number;
}

interface CrewMember extends MovieCredit {
  credit_id: string;
  department: string;
  job: string;
  id: number;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}
