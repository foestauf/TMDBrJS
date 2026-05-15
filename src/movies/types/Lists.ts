import type { Movie } from './MovieCast';
import type { Paginated } from '../../utils/types';

export interface DatedMovieList extends Paginated<Movie> {
  dates: { maximum: string; minimum: string };
}

export type NowPlayingMovies = DatedMovieList;
export type UpcomingMovies = DatedMovieList;

export interface MovieListItem {
  description: string;
  favoriteCount: number;
  id: number;
  itemCount: number;
  iso6391: string;
  listType: string;
  name: string;
  posterPath: string | null;
}

export interface MovieLists extends Paginated<MovieListItem> {
  id: number;
}
