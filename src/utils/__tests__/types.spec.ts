import { describe, it, expectTypeOf } from 'vitest';
import type { Paginated } from '../types';

describe('Paginated<T>', () => {
  it('has the canonical TMDB paginated shape', () => {
    type MovieStub = { id: number; title: string };
    type R = Paginated<MovieStub>;
    expectTypeOf<R>().toHaveProperty('page').toEqualTypeOf<number>();
    expectTypeOf<R>().toHaveProperty('totalPages').toEqualTypeOf<number>();
    expectTypeOf<R>().toHaveProperty('totalResults').toEqualTypeOf<number>();
    expectTypeOf<R>().toHaveProperty('results').toEqualTypeOf<MovieStub[]>();
  });
});
