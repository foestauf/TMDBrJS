import type { Movie } from '../../movies/types/MovieCast';
import type { TvShow } from '../../tv/types/TvShow';
import type { Person } from '../../people/types/Person';
import type { Paginated } from '../../utils/types';

export type TrendingWindow = 'day' | 'week';

export type TrendingMulti =
  | (Movie & { mediaType: 'movie' })
  | (TvShow & { mediaType: 'tv' })
  | (Person & { mediaType: 'person' });

export type TrendingMoviesResponse = Paginated<Movie>;
export type TrendingTvResponse = Paginated<TvShow>;
export type TrendingPeopleResponse = Paginated<Person>;
export type TrendingAllResponse = Paginated<TrendingMulti>;
