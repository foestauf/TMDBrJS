import { describe, it, expect } from 'vitest';
import { serializeDiscoverQuery } from '../serializeQuery';
import ApiURL from '../../utils/apiURL';

function paramsFrom(query: unknown): URLSearchParams {
  const url = new ApiURL('discover/movie');
  serializeDiscoverQuery(url, query as Record<string, unknown>);
  return url.getURL().searchParams;
}

describe('serializeDiscoverQuery', () => {
  it('converts camelCase keys to snake_case', () => {
    const params = paramsFrom({ sortBy: 'popularity.desc', primaryReleaseYear: 2026 });
    expect(params.get('sort_by')).toBe('popularity.desc');
    expect(params.get('primary_release_year')).toBe('2026');
  });

  it('joins number arrays with commas (AND semantics)', () => {
    const params = paramsFrom({ withGenres: [28, 12] });
    expect(params.get('with_genres')).toBe('28,12');
  });

  it('passes string values through (allows callers to use |-joined OR if needed)', () => {
    const params = paramsFrom({ withGenres: '28|12' });
    expect(params.get('with_genres')).toBe('28|12');
  });

  it('stringifies booleans as true/false', () => {
    const params = paramsFrom({ includeAdult: false });
    expect(params.get('include_adult')).toBe('false');
  });

  it('omits undefined and null values', () => {
    const params = paramsFrom({ sortBy: 'popularity.desc', primaryReleaseYear: undefined });
    expect(params.has('primary_release_year')).toBe(false);
  });

  it('handles an empty/undefined query object', () => {
    const params = paramsFrom(undefined);
    expect([...params.keys()]).toEqual([]);
  });
});
