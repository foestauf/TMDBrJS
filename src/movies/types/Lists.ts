import type { Movie } from './MovieCast';
import type { Paginated } from '../../utils/types';

export interface DatedMovieList extends Paginated<Movie> {
  dates: { maximum: string; minimum: string };
}

export type NowPlayingMovies = DatedMovieList;
export type UpcomingMovies = DatedMovieList;
