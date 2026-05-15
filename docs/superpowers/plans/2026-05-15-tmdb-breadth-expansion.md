# TMDB Breadth Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `search`, `discover`, `trending`, `genres`, and `configuration` services, and bring `Movies`/`People` to endpoint parity with `Tv`. Additive only; ships as a semver minor.

**Architecture:** Each new service extends the existing `BaseService` pattern (when it supports `append_to_response`) or takes `IApiClient` directly. All URL building uses `ApiURL`. Pagination is `page?: number`, omitted from the request when undefined. Types are hand-rolled and co-located. A shared `Paginated<T>` type replaces the `{ page; results; totalPages; totalResults }` shape for *new* code (old types stay put).

**Tech Stack:** TypeScript, tsdown bundler, vitest (with `vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(...)`), ESM-first.

**Spec:** `docs/superpowers/specs/2026-05-15-tmdb-breadth-expansion-design.md`

**Branch:** `feat/breadth-expansion` (single branch, 5 PRs against it).

---

## Phase boundaries (= PR boundaries)

| Phase | Tasks | PR |
|---|---|---|
| 1 — Foundation | 1–7 | PR 1: foundation: Paginated type, Movies ApiURL migration, pagination, deprecate duplicate |
| 2 — Movies parity | 8–23 | PR 2: movies: parity with Tv coverage |
| 3 — People parity | 24–27 | PR 3: people: latest, changes, externalIds, translations |
| 4 — Lookup services | 28–32 | PR 4: services: genres, configuration, trending |
| 5 — Search & Discover | 33–42 | PR 5: services: search and discover |

At the **end of each phase**, run `npm run lint && npm run check-types && npm test`, push, open PR against `feat/breadth-expansion`. The branch lands as one squash to `main` when all 5 PRs are merged → semantic-release publishes a minor version.

---

## Conventions used throughout

- **Branch creation (first task only):** `git checkout -b feat/breadth-expansion`. Subsequent tasks commit onto this branch.
- **Test pattern:** `vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue(response)` then call the method. Assert response shape and (where the URL matters) `expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('...'))`.
- **Test file location:** co-located `src/<service>/__tests__/<service>.spec.ts`. Append `describe` blocks to existing files when the file exists for the service.
- **Imports inside service files:** prefer named imports from `./types/<File>` (no `.js` extension — tsdown handles it).
- **Commit message format:** Conventional Commits. `feat(<scope>): ...`, `refactor(<scope>): ...`, `chore(<scope>): ...`, `docs: ...`.
- **Never run** `git push --force`, `git reset --hard`, or hooks-bypass flags.

---

# Phase 1 — Foundation (PR 1)

### Task 1: Create feature branch and shared `Paginated<T>` type

**Files:**
- Create: `src/utils/types.ts`
- Create: `src/utils/__tests__/types.spec.ts`

- [ ] **Step 1.1: Cut the feature branch**

```bash
git checkout main
git pull --ff-only
git checkout -b feat/breadth-expansion
```

- [ ] **Step 1.2: Write the failing test**

Create `src/utils/__tests__/types.spec.ts`:

```ts
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
```

- [ ] **Step 1.3: Run the test, expect failure**

Run: `npx vitest run src/utils/__tests__/types.spec.ts`
Expected: FAIL (`Cannot find module '../types'`).

- [ ] **Step 1.4: Implement the type**

Create `src/utils/types.ts`:

```ts
export interface Paginated<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
```

- [ ] **Step 1.5: Run the test, expect pass**

Run: `npx vitest run src/utils/__tests__/types.spec.ts`
Expected: PASS.

- [ ] **Step 1.6: Commit**

```bash
git add src/utils/types.ts src/utils/__tests__/types.spec.ts
git commit -m "feat(utils): add Paginated<T> shared type"
```

---

### Task 2: Migrate `Movies.getPopular` to `ApiURL` (no behaviour change)

**Files:**
- Modify: `src/movies/movies.ts:36-38`
- Modify: `src/movies/__tests__/movie.spec.ts` (extend existing `describe('getPopular')`)

- [ ] **Step 2.1: Add a failing test asserting the URL/param shape**

Append inside `describe('getPopular', () => { ... })` in `src/movies/__tests__/movie.spec.ts`:

```ts
it('omits the page param when no page is provided', async () => {
  vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
  await tmdb.movies.getPopular();
  const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
  expect(calledWith).not.toContain('page=');
  expect(calledWith).toContain('movie/popular');
});

it('passes the page param when provided', async () => {
  vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
  await tmdb.movies.getPopular(3);
  expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=3'));
});
```

- [ ] **Step 2.2: Run the tests, expect the "omits page" one to fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL on "omits the page param when no page is provided" (current impl always sends `page=1`).

- [ ] **Step 2.3: Rewrite `getPopular` to use `ApiURL`**

In `src/movies/movies.ts`, replace the `getPopular` implementation:

```ts
async getPopular(page?: number) {
  const url = new ApiURL('movie/popular');
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<PopularMovies>(url.toString());
}
```

Add the `ApiURL` import at top:

```ts
import ApiURL from '../utils/apiURL';
```

- [ ] **Step 2.4: Run all movie tests, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 2.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "refactor(movies): use ApiURL in getPopular and omit page when unspecified"
```

---

### Task 3: Add pagination to `Movies.getTopRated` (with `ApiURL`)

**Files:**
- Modify: `src/movies/movies.ts:40-43`
- Modify: `src/movies/__tests__/movie.spec.ts` (extend `describe('getTopRated')`)

- [ ] **Step 3.1: Failing test for pagination**

Append inside `describe('getTopRated', ...)`:

```ts
it('passes the page param when provided', async () => {
  vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
  await tmdb.movies.getTopRated(2);
  expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
});

it('hits movie/top_rated', async () => {
  vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
  await tmdb.movies.getTopRated();
  expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/top_rated'));
});
```

- [ ] **Step 3.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL on the pagination test (`getTopRated` currently takes no arg).

- [ ] **Step 3.3: Implement**

Replace `getTopRated` in `src/movies/movies.ts`:

```ts
async getTopRated(page?: number): Promise<PopularMovies> {
  const url = new ApiURL('movie/top_rated');
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<PopularMovies>(url.toString());
}
```

- [ ] **Step 3.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 3.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add page param to getTopRated"
```

---

### Task 4: Migrate `Movies.getSimilar`, `getCredits`, `getDetails` to `ApiURL` + add pagination to `getSimilar`

**Files:**
- Modify: `src/movies/movies.ts:52-65`
- Modify: `src/movies/__tests__/movie.spec.ts` (add `describe('getSimilar')`, `describe('getCredits')` if missing, `describe('getDetails')`)

- [ ] **Step 4.1: Failing tests**

Append to `src/movies/__tests__/movie.spec.ts`:

```ts
describe('getSimilar', () => {
  it('hits movie/{id}/similar', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
    await tmdb.movies.getSimilar('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/similar'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [] });
    await tmdb.movies.getSimilar('550', 2);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});

describe('getDetails', () => {
  it('hits movie/{id}', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, title: 'Fight Club' });
    const result = await tmdb.movies.getDetails(550);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringMatching(/movie\/550(?!\/)/));
    expect(result).toEqual({ id: 550, title: 'Fight Club' });
  });
});
```

- [ ] **Step 4.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL on `getSimilar` pagination (signature has no `page` param).

- [ ] **Step 4.3: Implement**

In `src/movies/movies.ts`, replace the three methods:

```ts
async getSimilar(id: string | number, page?: number): Promise<SimilarMovies> {
  const url = new ApiURL(`movie/${id.toString()}/similar`);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<SimilarMovies>(url.toString());
}

async getCredits(id: string | number): Promise<MovieCredits> {
  const url = new ApiURL(`movie/${id.toString()}/credits`);
  return this.apiClient.get<MovieCredits>(url.toString());
}

async getDetails(id: string | number): Promise<Movie> {
  const url = new ApiURL(`movie/${id.toString()}`);
  return this.apiClient.get<Movie>(url.toString());
}
```

- [ ] **Step 4.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 4.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "refactor(movies): route getSimilar/getCredits/getDetails through ApiURL; add page param to getSimilar"
```

---

### Task 5: Deprecate `Movies.getMovieCredits`

**Files:**
- Modify: `src/movies/movies.ts:67-70`

- [ ] **Step 5.1: Add `@deprecated` JSDoc and route through `getCredits`**

Replace `getMovieCredits` in `src/movies/movies.ts`:

```ts
/**
 * @deprecated Use {@link Movies.getCredits} instead. This duplicate will be removed in a future major release.
 */
async getMovieCredits(id: string | number): Promise<MovieCredits> {
  return this.getCredits(id);
}
```

- [ ] **Step 5.2: Type check**

Run: `npm run check-types`
Expected: PASS.

- [ ] **Step 5.3: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5.4: Commit**

```bash
git add src/movies/movies.ts
git commit -m "refactor(movies): deprecate getMovieCredits in favor of getCredits"
```

---

### Task 6: Phase 1 verification & PR

- [ ] **Step 6.1: Lint, type check, full test pass**

Run all three:

```bash
npm run lint
npm run check-types
npm test
```

Expected: all PASS.

- [ ] **Step 6.2: Push the branch**

```bash
git push -u origin feat/breadth-expansion
```

- [ ] **Step 6.3: Open PR 1**

```bash
gh pr create --base main --head feat/breadth-expansion --title "feat: breadth-expansion phase 1 — foundation" --body "$(cat <<'EOF'
## Summary
- Adds `Paginated<T>` shared type for new code
- Migrates all `Movies` URL building to `ApiURL`
- Adds `page` param to `Movies.getTopRated` and `getSimilar`
- Deprecates duplicate `Movies.getMovieCredits` (routes to `getCredits`)

Phase 1 of the breadth-expansion design. See `docs/superpowers/specs/2026-05-15-tmdb-breadth-expansion-design.md`.

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run check-types` passes
- [ ] `npm test` passes
- [ ] No behavioural regressions in existing Movies endpoints

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed.

---

### Task 7: Wait for PR 1 to land, then continue on the same branch

PR 1 merges to `main` (or stays open against the branch — engineer's call). Subsequent tasks continue committing on `feat/breadth-expansion`. Re-sync if needed:

```bash
git checkout feat/breadth-expansion
git fetch origin
git rebase origin/main   # only if PR 1 merged to main
```

---

# Phase 2 — Movies parity (PR 2)

This phase adds 16 new methods on `Movies`. Each task follows the same shape: define type if needed → write failing test → run → implement → run → commit. **All tasks in this phase append `describe` blocks to `src/movies/__tests__/movie.spec.ts`.**

For brevity within each task: imports already established in Phase 1 (`ApiURL`, existing types) are not re-listed. New type imports are called out explicitly per task.

### Task 8: `Movies.getNowPlaying`

**Files:**
- Create: `src/movies/types/Lists.ts`
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 8.1: Define types**

Create `src/movies/types/Lists.ts`:

```ts
import type { Movie } from './MovieCast';
import type { Paginated } from '../../utils/types';

export interface DatedMovieList extends Paginated<Movie> {
  dates: { maximum: string; minimum: string };
}

export type NowPlayingMovies = DatedMovieList;
export type UpcomingMovies = DatedMovieList;
```

- [ ] **Step 8.2: Failing test**

Append to `src/movies/__tests__/movie.spec.ts`:

```ts
describe('getNowPlaying', () => {
  it('hits movie/now_playing', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
    await tmdb.movies.getNowPlaying();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/now_playing'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
    await tmdb.movies.getNowPlaying(4);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=4'));
  });
});
```

- [ ] **Step 8.3: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL (`tmdb.movies.getNowPlaying is not a function`).

- [ ] **Step 8.4: Implement**

Add to `src/movies/movies.ts` (alongside `getPopular`):

```ts
async getNowPlaying(page?: number): Promise<NowPlayingMovies> {
  const url = new ApiURL('movie/now_playing');
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<NowPlayingMovies>(url.toString());
}
```

And import the type at the top:

```ts
import type { NowPlayingMovies, UpcomingMovies } from './types/Lists';
```

- [ ] **Step 8.5: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 8.6: Commit**

```bash
git add src/movies/types/Lists.ts src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getNowPlaying"
```

---

### Task 9: `Movies.getUpcoming`

**Files:**
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

(`UpcomingMovies` type was created in Task 8.)

- [ ] **Step 9.1: Failing test**

```ts
describe('getUpcoming', () => {
  it('hits movie/upcoming', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
    await tmdb.movies.getUpcoming();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/upcoming'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ results: [], dates: { maximum: '', minimum: '' } });
    await tmdb.movies.getUpcoming(5);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=5'));
  });
});
```

- [ ] **Step 9.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 9.3: Implement**

```ts
async getUpcoming(page?: number): Promise<UpcomingMovies> {
  const url = new ApiURL('movie/upcoming');
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<UpcomingMovies>(url.toString());
}
```

- [ ] **Step 9.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 9.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getUpcoming"
```

---

### Task 10: `Movies.getLatest`

**Files:**
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 10.1: Failing test**

```ts
describe('getLatest', () => {
  it('hits movie/latest', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 123, title: 'Latest' });
    const result = await tmdb.movies.getLatest();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/latest'));
    expect(result).toEqual({ id: 123, title: 'Latest' });
  });
});
```

- [ ] **Step 10.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 10.3: Implement**

```ts
async getLatest(): Promise<Movie> {
  const url = new ApiURL('movie/latest');
  return this.apiClient.get<Movie>(url.toString());
}
```

- [ ] **Step 10.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 10.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getLatest"
```

---

### Task 11: `Movies.getImages`

**Files:**
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

(`Images` already defined in `src/movies/types/MovieCast.ts`.)

- [ ] **Step 11.1: Failing test**

```ts
describe('getImages', () => {
  it('hits movie/{id}/images', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, backdrops: [], posters: [] });
    await tmdb.movies.getImages('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/images'));
  });
});
```

- [ ] **Step 11.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 11.3: Implement**

```ts
async getImages(id: string | number): Promise<Images> {
  const url = new ApiURL(`movie/${id.toString()}/images`);
  return this.apiClient.get<Images>(url.toString());
}
```

- [ ] **Step 11.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 11.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getImages"
```

---

### Task 12: `Movies.getVideos`

- [ ] **Step 12.1: Failing test**

```ts
describe('getVideos', () => {
  it('hits movie/{id}/videos', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: [] });
    await tmdb.movies.getVideos('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/videos'));
  });
});
```

- [ ] **Step 12.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 12.3: Implement**

```ts
async getVideos(id: string | number): Promise<Videos> {
  const url = new ApiURL(`movie/${id.toString()}/videos`);
  return this.apiClient.get<Videos>(url.toString());
}
```

- [ ] **Step 12.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 12.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getVideos"
```

---

### Task 13: `Movies.getReviews`

- [ ] **Step 13.1: Failing test**

```ts
describe('getReviews', () => {
  it('hits movie/{id}/reviews', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.movies.getReviews('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/reviews'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 2, results: [], totalPages: 2, totalResults: 0 });
    await tmdb.movies.getReviews('550', 2);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
```

- [ ] **Step 13.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 13.3: Implement**

```ts
async getReviews(id: string | number, page?: number): Promise<Reviews> {
  const url = new ApiURL(`movie/${id.toString()}/reviews`);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<Reviews>(url.toString());
}
```

- [ ] **Step 13.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 13.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getReviews"
```

---

### Task 14: `Movies.getRecommendations`

- [ ] **Step 14.1: Failing test**

```ts
describe('getRecommendations', () => {
  it('hits movie/{id}/recommendations', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.movies.getRecommendations('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/recommendations'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 2, results: [], totalPages: 2, totalResults: 0 });
    await tmdb.movies.getRecommendations('550', 2);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
```

- [ ] **Step 14.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 14.3: Implement**

```ts
async getRecommendations(id: string | number, page?: number): Promise<Recommendations> {
  const url = new ApiURL(`movie/${id.toString()}/recommendations`);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<Recommendations>(url.toString());
}
```

- [ ] **Step 14.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 14.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getRecommendations"
```

---

### Task 15: `Movies.getKeywords`

- [ ] **Step 15.1: Failing test**

```ts
describe('getKeywords', () => {
  it('hits movie/{id}/keywords', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, keywords: [] });
    await tmdb.movies.getKeywords('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/keywords'));
  });
});
```

- [ ] **Step 15.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 15.3: Implement**

```ts
async getKeywords(id: string | number): Promise<Keywords> {
  const url = new ApiURL(`movie/${id.toString()}/keywords`);
  return this.apiClient.get<Keywords>(url.toString());
}
```

- [ ] **Step 15.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 15.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getKeywords"
```

---

### Task 16: `Movies.getReleaseDates`

- [ ] **Step 16.1: Failing test**

```ts
describe('getReleaseDates', () => {
  it('hits movie/{id}/release_dates', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: [] });
    await tmdb.movies.getReleaseDates('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/release_dates'));
  });
});
```

- [ ] **Step 16.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 16.3: Implement**

```ts
async getReleaseDates(id: string | number): Promise<ReleaseDates> {
  const url = new ApiURL(`movie/${id.toString()}/release_dates`);
  return this.apiClient.get<ReleaseDates>(url.toString());
}
```

- [ ] **Step 16.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 16.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getReleaseDates"
```

---

### Task 17: `Movies.getTranslations`

- [ ] **Step 17.1: Failing test**

```ts
describe('getTranslations', () => {
  it('hits movie/{id}/translations', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, translations: [] });
    await tmdb.movies.getTranslations('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/translations'));
  });
});
```

- [ ] **Step 17.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 17.3: Implement**

```ts
async getTranslations(id: string | number): Promise<Translations> {
  const url = new ApiURL(`movie/${id.toString()}/translations`);
  return this.apiClient.get<Translations>(url.toString());
}
```

- [ ] **Step 17.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 17.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getTranslations"
```

---

### Task 18: `Movies.getExternalIds`

- [ ] **Step 18.1: Failing test**

```ts
describe('getExternalIds', () => {
  it('hits movie/{id}/external_ids', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, imdbId: 'tt0137523' });
    await tmdb.movies.getExternalIds('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/external_ids'));
  });
});
```

- [ ] **Step 18.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 18.3: Implement**

```ts
async getExternalIds(id: string | number): Promise<ExternalIds> {
  const url = new ApiURL(`movie/${id.toString()}/external_ids`);
  return this.apiClient.get<ExternalIds>(url.toString());
}
```

- [ ] **Step 18.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 18.5: Commit**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getExternalIds"
```

---

### Task 19: `Movies.getAlternativeTitles`

**Files:**
- Modify: `src/movies/types/MovieCast.ts` (add `AlternativeTitles`)
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 19.1: Add the type**

Append to `src/movies/types/MovieCast.ts`:

```ts
export interface AlternativeTitles {
  id: number;
  titles: Array<{
    iso31661: string;
    title: string;
    type: string;
  }>;
}
```

- [ ] **Step 19.2: Failing test**

```ts
describe('getAlternativeTitles', () => {
  it('hits movie/{id}/alternative_titles', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, titles: [] });
    await tmdb.movies.getAlternativeTitles('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/alternative_titles'));
  });
});
```

- [ ] **Step 19.3: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 19.4: Implement**

Add `AlternativeTitles` to the imports from `./types/MovieCast.js` at the top of `src/movies/movies.ts`, then add the method:

```ts
async getAlternativeTitles(id: string | number): Promise<AlternativeTitles> {
  const url = new ApiURL(`movie/${id.toString()}/alternative_titles`);
  return this.apiClient.get<AlternativeTitles>(url.toString());
}
```

- [ ] **Step 19.5: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 19.6: Commit**

```bash
git add src/movies/types/MovieCast.ts src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getAlternativeTitles"
```

---

### Task 20: `Movies.getWatchProviders`

**Files:**
- Modify: `src/movies/types/MovieCast.ts` (add `WatchProviders`)
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 20.1: Add the type**

Append to `src/movies/types/MovieCast.ts`:

```ts
export interface WatchProviders {
  id: number;
  results: Record<
    string,
    {
      link: string;
      flatrate?: Array<{ logoPath: string; providerId: number; providerName: string; displayPriority: number }>;
      rent?: Array<{ logoPath: string; providerId: number; providerName: string; displayPriority: number }>;
      buy?: Array<{ logoPath: string; providerId: number; providerName: string; displayPriority: number }>;
    }
  >;
}
```

- [ ] **Step 20.2: Failing test**

```ts
describe('getWatchProviders', () => {
  it('hits movie/{id}/watch/providers', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, results: {} });
    await tmdb.movies.getWatchProviders('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/watch/providers'));
  });
});
```

- [ ] **Step 20.3: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 20.4: Implement**

Add `WatchProviders` to imports, add method:

```ts
async getWatchProviders(id: string | number): Promise<WatchProviders> {
  const url = new ApiURL(`movie/${id.toString()}/watch/providers`);
  return this.apiClient.get<WatchProviders>(url.toString());
}
```

- [ ] **Step 20.5: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 20.6: Commit**

```bash
git add src/movies/types/MovieCast.ts src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getWatchProviders"
```

---

### Task 21: `Movies.getLists`

**Files:**
- Modify: `src/movies/types/Lists.ts` (add `MovieLists`)
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 21.1: Add the type**

Append to `src/movies/types/Lists.ts`:

```ts
import type { Paginated } from '../../utils/types';

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
```

(`Paginated` import is already present from Task 8.)

- [ ] **Step 21.2: Failing test**

```ts
describe('getLists', () => {
  it('hits movie/{id}/lists', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.movies.getLists('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/lists'));
  });
  it('passes the page param when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, page: 2, results: [], totalPages: 2, totalResults: 0 });
    await tmdb.movies.getLists('550', 2);
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
```

- [ ] **Step 21.3: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 21.4: Implement**

Add `MovieLists` to the existing `import type { NowPlayingMovies, UpcomingMovies } from './types/Lists';` line. Add method:

```ts
async getLists(id: string | number, page?: number): Promise<MovieLists> {
  const url = new ApiURL(`movie/${id.toString()}/lists`);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<MovieLists>(url.toString());
}
```

- [ ] **Step 21.5: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 21.6: Commit**

```bash
git add src/movies/types/Lists.ts src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getLists"
```

---

### Task 22: `Movies.getChanges`

**Files:**
- Create: `src/movies/types/Changes.ts`
- Modify: `src/movies/movies.ts`
- Modify: `src/movies/__tests__/movie.spec.ts`

- [ ] **Step 22.1: Define the type**

Create `src/movies/types/Changes.ts`:

```ts
export interface MovieChangeItem {
  id: string;
  action: string;
  time: string;
  iso6391?: string;
  iso31661?: string;
  value?: unknown;
  originalValue?: unknown;
}

export interface MovieChanges {
  changes: Array<{
    key: string;
    items: MovieChangeItem[];
  }>;
}
```

- [ ] **Step 22.2: Failing test**

```ts
describe('getChanges', () => {
  it('hits movie/{id}/changes', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
    await tmdb.movies.getChanges('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/changes'));
  });
  it('passes startDate, endDate, and page when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
    await tmdb.movies.getChanges('550', '2026-01-01', '2026-02-01', 2);
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toContain('start_date=2026-01-01');
    expect(calledWith).toContain('end_date=2026-02-01');
    expect(calledWith).toContain('page=2');
  });
});
```

- [ ] **Step 22.3: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 22.4: Implement**

Add the import at the top of `src/movies/movies.ts`:

```ts
import type { MovieChanges } from './types/Changes';
```

Add the method:

```ts
async getChanges(
  id: string | number,
  startDate?: string,
  endDate?: string,
  page?: number,
): Promise<MovieChanges> {
  const url = new ApiURL(`movie/${id.toString()}/changes`);
  if (startDate) url.appendParam('start_date', startDate);
  if (endDate) url.appendParam('end_date', endDate);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<MovieChanges>(url.toString());
}
```

- [ ] **Step 22.5: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 22.6: Commit**

```bash
git add src/movies/types/Changes.ts src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getChanges"
```

---

### Task 23: `Movies.getAccountStates` + Phase 2 PR

- [ ] **Step 23.1: Failing test**

```ts
describe('getAccountStates', () => {
  it('hits movie/{id}/account_states', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 550, favorite: false, rated: false, watchlist: false });
    await tmdb.movies.getAccountStates('550');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('movie/550/account_states'));
  });
});
```

- [ ] **Step 23.2: Run, expect fail**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: FAIL.

- [ ] **Step 23.3: Implement**

```ts
async getAccountStates(id: string | number): Promise<AccountStates> {
  const url = new ApiURL(`movie/${id.toString()}/account_states`);
  return this.apiClient.get<AccountStates>(url.toString());
}
```

- [ ] **Step 23.4: Run, expect pass**

Run: `npx vitest run src/movies/__tests__/movie.spec.ts`
Expected: PASS.

- [ ] **Step 23.5: Phase 2 verification**

```bash
npm run lint
npm run check-types
npm test
```

Expected: all PASS.

- [ ] **Step 23.6: Commit + push + PR 2**

```bash
git add src/movies/movies.ts src/movies/__tests__/movie.spec.ts
git commit -m "feat(movies): add getAccountStates"
git push
gh pr create --base main --head feat/breadth-expansion --title "feat: breadth-expansion phase 2 — movies parity" --body "$(cat <<'EOF'
## Summary
Adds 16 new methods on `Movies` to reach parity with `Tv` coverage:
nowPlaying, upcoming, latest, images, videos, reviews, recommendations,
keywords, releaseDates, translations, externalIds, alternativeTitles,
watchProviders, lists, changes, accountStates.

Phase 2 of the breadth-expansion design.

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run check-types` passes
- [ ] `npm test` passes
- [ ] All new methods have unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Phase 3 — People parity (PR 3)

### Task 24: `People.getLatest`

**Files:**
- Modify: `src/people/people.ts`
- Modify: `src/people/__tests__/people.spec.ts`

- [ ] **Step 24.1: Failing test**

Append to `src/people/__tests__/people.spec.ts`:

```ts
describe('getLatest', () => {
  it('hits person/latest', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 1, name: 'Latest Person' });
    const result = await tmdb.people.getLatest();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/latest'));
    expect(result).toEqual({ id: 1, name: 'Latest Person' });
  });
});
```

- [ ] **Step 24.2: Run, expect fail**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: FAIL.

- [ ] **Step 24.3: Implement**

Add to `src/people/people.ts`:

```ts
async getLatest(): Promise<Person> {
  const url = new ApiURL('person/latest');
  return this.apiClient.get<Person>(url.toString());
}
```

- [ ] **Step 24.4: Run, expect pass**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: PASS.

- [ ] **Step 24.5: Commit**

```bash
git add src/people/people.ts src/people/__tests__/people.spec.ts
git commit -m "feat(people): add getLatest"
```

---

### Task 25: `People.getChanges`

**Files:**
- Create: `src/people/types/Changes.ts`
- Modify: `src/people/people.ts`
- Modify: `src/people/__tests__/people.spec.ts`

- [ ] **Step 25.1: Define the type**

Create `src/people/types/Changes.ts`:

```ts
export interface PersonChangeItem {
  id: string;
  action: string;
  time: string;
  iso6391?: string;
  iso31661?: string;
  value?: unknown;
  originalValue?: unknown;
}

export interface PersonChanges {
  changes: Array<{
    key: string;
    items: PersonChangeItem[];
  }>;
}
```

- [ ] **Step 25.2: Failing test**

```ts
describe('getChanges', () => {
  it('hits person/{id}/changes', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
    await tmdb.people.getChanges('287');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/287/changes'));
  });
  it('passes startDate, endDate, and page when provided', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ changes: [] });
    await tmdb.people.getChanges('287', '2026-01-01', '2026-02-01', 2);
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toContain('start_date=2026-01-01');
    expect(calledWith).toContain('end_date=2026-02-01');
    expect(calledWith).toContain('page=2');
  });
});
```

- [ ] **Step 25.3: Run, expect fail**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: FAIL.

- [ ] **Step 25.4: Implement**

Add the import in `src/people/people.ts`:

```ts
import type { PersonChanges } from './types/Changes';
```

Add the method:

```ts
async getChanges(
  id: string | number,
  startDate?: string,
  endDate?: string,
  page?: number,
): Promise<PersonChanges> {
  const url = new ApiURL(`person/${id.toString()}/changes`);
  if (startDate) url.appendParam('start_date', startDate);
  if (endDate) url.appendParam('end_date', endDate);
  if (page) url.appendParam('page', page.toString());
  return this.apiClient.get<PersonChanges>(url.toString());
}
```

- [ ] **Step 25.5: Run, expect pass**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: PASS.

- [ ] **Step 25.6: Commit**

```bash
git add src/people/types/Changes.ts src/people/people.ts src/people/__tests__/people.spec.ts
git commit -m "feat(people): add getChanges"
```

---

### Task 26: `People.getExternalIds`

(`ExternalIds` is already defined in `src/people/types/Person.ts`.)

- [ ] **Step 26.1: Failing test**

```ts
describe('getExternalIds', () => {
  it('hits person/{id}/external_ids', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 287, imdbId: 'nm0000148' });
    await tmdb.people.getExternalIds('287');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/287/external_ids'));
  });
});
```

- [ ] **Step 26.2: Run, expect fail**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: FAIL.

- [ ] **Step 26.3: Implement**

```ts
async getExternalIds(id: string | number): Promise<ExternalIds> {
  const url = new ApiURL(`person/${id.toString()}/external_ids`);
  return this.apiClient.get<ExternalIds>(url.toString());
}
```

- [ ] **Step 26.4: Run, expect pass**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: PASS.

- [ ] **Step 26.5: Commit**

```bash
git add src/people/people.ts src/people/__tests__/people.spec.ts
git commit -m "feat(people): add getExternalIds"
```

---

### Task 27: `People.getTranslations` + Phase 3 PR

(`Translations` is already defined in `src/people/types/Person.ts`.)

- [ ] **Step 27.1: Failing test**

```ts
describe('getTranslations', () => {
  it('hits person/{id}/translations', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ id: 287, translations: [] });
    await tmdb.people.getTranslations('287');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('person/287/translations'));
  });
});
```

- [ ] **Step 27.2: Run, expect fail**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: FAIL.

- [ ] **Step 27.3: Implement**

```ts
async getTranslations(id: string | number): Promise<Translations> {
  const url = new ApiURL(`person/${id.toString()}/translations`);
  return this.apiClient.get<Translations>(url.toString());
}
```

- [ ] **Step 27.4: Run, expect pass**

Run: `npx vitest run src/people/__tests__/people.spec.ts`
Expected: PASS.

- [ ] **Step 27.5: Phase 3 verification**

```bash
npm run lint
npm run check-types
npm test
```

Expected: all PASS.

- [ ] **Step 27.6: Commit + push + PR 3**

```bash
git add src/people/people.ts src/people/__tests__/people.spec.ts
git commit -m "feat(people): add getTranslations"
git push
gh pr create --base main --head feat/breadth-expansion --title "feat: breadth-expansion phase 3 — people parity" --body "$(cat <<'EOF'
## Summary
Adds 4 new methods on `People` to fill the parity gaps:
getLatest, getChanges, getExternalIds, getTranslations.

Phase 3 of the breadth-expansion design.

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run check-types` passes
- [ ] `npm test` passes

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Phase 4 — Lookup services (PR 4)

### Task 28: `Genres` service

**Files:**
- Create: `src/genres/genres.ts`
- Create: `src/genres/types/Genre.ts`
- Create: `src/genres/__tests__/genres.spec.ts`
- Modify: `src/index.ts`

- [ ] **Step 28.1: Define types**

Create `src/genres/types/Genre.ts`:

```ts
export interface Genre {
  id: number;
  name: string;
}

export interface GenreList {
  genres: Genre[];
}
```

- [ ] **Step 28.2: Failing tests**

Create `src/genres/__tests__/genres.spec.ts`:

```ts
import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Genres', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('movies', () => {
    it('hits genre/movie/list', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ genres: [{ id: 28, name: 'Action' }] });
      const result = await tmdb.genres.movies();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('genre/movie/list'));
      expect(result.genres[0]).toEqual({ id: 28, name: 'Action' });
    });
  });

  describe('tv', () => {
    it('hits genre/tv/list', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ genres: [{ id: 18, name: 'Drama' }] });
      const result = await tmdb.genres.tv();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('genre/tv/list'));
      expect(result.genres[0]).toEqual({ id: 18, name: 'Drama' });
    });
  });
});
```

- [ ] **Step 28.3: Run, expect fail**

Run: `npx vitest run src/genres/__tests__/genres.spec.ts`
Expected: FAIL (module not found).

- [ ] **Step 28.4: Implement**

Create `src/genres/genres.ts`:

```ts
import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type { GenreList } from './types/Genre';

class Genres {
  constructor(private apiClient: IApiClient) {}

  async movies(): Promise<GenreList> {
    const url = new ApiURL('genre/movie/list');
    return this.apiClient.get<GenreList>(url.toString());
  }

  async tv(): Promise<GenreList> {
    const url = new ApiURL('genre/tv/list');
    return this.apiClient.get<GenreList>(url.toString());
  }
}

export default Genres;
```

Wire it up in `src/index.ts`:

1. Add the import at the top:
   ```ts
   import Genres from './genres/genres';
   ```
2. Add the field on `Client`:
   ```ts
   genres: Genres;
   ```
3. Construct it in the constructor (after `this.tv = ...`):
   ```ts
   this.genres = new Genres(this.apiClient);
   ```
4. Re-export the type at the bottom:
   ```ts
   export type { Genre, GenreList } from './genres/types/Genre';
   ```

- [ ] **Step 28.5: Run, expect pass**

Run: `npx vitest run src/genres/__tests__/genres.spec.ts`
Expected: PASS.

- [ ] **Step 28.6: Commit**

```bash
git add src/genres src/index.ts
git commit -m "feat(genres): add genres service with movies() and tv()"
```

---

### Task 29: `Configuration` service

**Files:**
- Create: `src/configuration/configuration.ts`
- Create: `src/configuration/types/Configuration.ts`
- Create: `src/configuration/__tests__/configuration.spec.ts`
- Modify: `src/index.ts`

- [ ] **Step 29.1: Define types**

Create `src/configuration/types/Configuration.ts`:

```ts
export interface ConfigurationDetails {
  images: {
    baseUrl: string;
    secureBaseUrl: string;
    backdropSizes: string[];
    logoSizes: string[];
    posterSizes: string[];
    profileSizes: string[];
    stillSizes: string[];
  };
  changeKeys: string[];
}

export interface CountryConfig {
  iso31661: string;
  englishName: string;
  nativeName: string;
}

export interface LanguageConfig {
  iso6391: string;
  englishName: string;
  name: string;
}

export interface JobConfig {
  department: string;
  jobs: string[];
}

export interface TimezoneConfig {
  iso31661: string;
  zones: string[];
}
```

- [ ] **Step 29.2: Failing tests**

Create `src/configuration/__tests__/configuration.spec.ts`:

```ts
import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Configuration', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  it('details() hits configuration', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ images: {}, changeKeys: [] });
    await tmdb.configuration.details();
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toMatch(/configuration(\?|$)/);
  });

  it('countries() hits configuration/countries', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.countries();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/countries'));
  });

  it('languages() hits configuration/languages', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.languages();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/languages'));
  });

  it('jobs() hits configuration/jobs', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.jobs();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/jobs'));
  });

  it('primaryTranslations() hits configuration/primary_translations', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.primaryTranslations();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/primary_translations'));
  });

  it('timezones() hits configuration/timezones', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.timezones();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/timezones'));
  });
});
```

- [ ] **Step 29.3: Run, expect fail**

Run: `npx vitest run src/configuration/__tests__/configuration.spec.ts`
Expected: FAIL.

- [ ] **Step 29.4: Implement**

Create `src/configuration/configuration.ts`:

```ts
import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  ConfigurationDetails,
  CountryConfig,
  LanguageConfig,
  JobConfig,
  TimezoneConfig,
} from './types/Configuration';

class Configuration {
  constructor(private apiClient: IApiClient) {}

  async details(): Promise<ConfigurationDetails> {
    const url = new ApiURL('configuration');
    return this.apiClient.get<ConfigurationDetails>(url.toString());
  }

  async countries(): Promise<CountryConfig[]> {
    const url = new ApiURL('configuration/countries');
    return this.apiClient.get<CountryConfig[]>(url.toString());
  }

  async languages(): Promise<LanguageConfig[]> {
    const url = new ApiURL('configuration/languages');
    return this.apiClient.get<LanguageConfig[]>(url.toString());
  }

  async jobs(): Promise<JobConfig[]> {
    const url = new ApiURL('configuration/jobs');
    return this.apiClient.get<JobConfig[]>(url.toString());
  }

  async primaryTranslations(): Promise<string[]> {
    const url = new ApiURL('configuration/primary_translations');
    return this.apiClient.get<string[]>(url.toString());
  }

  async timezones(): Promise<TimezoneConfig[]> {
    const url = new ApiURL('configuration/timezones');
    return this.apiClient.get<TimezoneConfig[]>(url.toString());
  }
}

export default Configuration;
```

Wire it up in `src/index.ts`:

1. Add the import at the top:
   ```ts
   import Configuration from './configuration/configuration';
   ```
2. Add the field on `Client`:
   ```ts
   configuration: Configuration;
   ```
3. Construct it in the constructor (after `this.genres = ...`):
   ```ts
   this.configuration = new Configuration(this.apiClient);
   ```
4. Re-export the types at the bottom:
   ```ts
   export type {
     ConfigurationDetails,
     CountryConfig,
     LanguageConfig,
     JobConfig,
     TimezoneConfig,
   } from './configuration/types/Configuration';
   ```

- [ ] **Step 29.5: Run, expect pass**

Run: `npx vitest run src/configuration/__tests__/configuration.spec.ts`
Expected: PASS.

- [ ] **Step 29.6: Commit**

```bash
git add src/configuration src/index.ts
git commit -m "feat(configuration): add configuration service"
```

---

### Task 30: `Trending` service

**Files:**
- Create: `src/trending/trending.ts`
- Create: `src/trending/types/Trending.ts`
- Create: `src/trending/__tests__/trending.spec.ts`
- Modify: `src/index.ts`

- [ ] **Step 30.1: Define types**

Create `src/trending/types/Trending.ts`:

```ts
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
```

- [ ] **Step 30.2: Failing tests**

Create `src/trending/__tests__/trending.spec.ts`:

```ts
import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Trending', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  it('all(day) hits trending/all/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.all('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/all/day'));
  });

  it('all(week) hits trending/all/week', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.all('week');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/all/week'));
  });

  it('movies(day) hits trending/movie/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.movies('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/movie/day'));
  });

  it('tv(week) hits trending/tv/week', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.tv('week');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/tv/week'));
  });

  it('people(day) hits trending/person/day', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.trending.people('day');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('trending/person/day'));
  });
});
```

- [ ] **Step 30.3: Run, expect fail**

Run: `npx vitest run src/trending/__tests__/trending.spec.ts`
Expected: FAIL.

- [ ] **Step 30.4: Implement**

Create `src/trending/trending.ts`:

```ts
import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  TrendingWindow,
  TrendingAllResponse,
  TrendingMoviesResponse,
  TrendingTvResponse,
  TrendingPeopleResponse,
} from './types/Trending';

class Trending {
  constructor(private apiClient: IApiClient) {}

  async all(window: TrendingWindow): Promise<TrendingAllResponse> {
    const url = new ApiURL(`trending/all/${window}`);
    return this.apiClient.get<TrendingAllResponse>(url.toString());
  }

  async movies(window: TrendingWindow): Promise<TrendingMoviesResponse> {
    const url = new ApiURL(`trending/movie/${window}`);
    return this.apiClient.get<TrendingMoviesResponse>(url.toString());
  }

  async tv(window: TrendingWindow): Promise<TrendingTvResponse> {
    const url = new ApiURL(`trending/tv/${window}`);
    return this.apiClient.get<TrendingTvResponse>(url.toString());
  }

  async people(window: TrendingWindow): Promise<TrendingPeopleResponse> {
    const url = new ApiURL(`trending/person/${window}`);
    return this.apiClient.get<TrendingPeopleResponse>(url.toString());
  }
}

export default Trending;
```

Wire it up in `src/index.ts`:

1. Add the import at the top:
   ```ts
   import Trending from './trending/trending';
   ```
2. Add the field on `Client`:
   ```ts
   trending: Trending;
   ```
3. Construct it in the constructor (after `this.configuration = ...`):
   ```ts
   this.trending = new Trending(this.apiClient);
   ```
4. Re-export the types at the bottom:
   ```ts
   export type {
     TrendingWindow,
     TrendingMulti,
     TrendingAllResponse,
     TrendingMoviesResponse,
     TrendingTvResponse,
     TrendingPeopleResponse,
   } from './trending/types/Trending';
   ```

- [ ] **Step 30.5: Run, expect pass**

Run: `npx vitest run src/trending/__tests__/trending.spec.ts`
Expected: PASS.

- [ ] **Step 30.6: Commit**

```bash
git add src/trending src/index.ts
git commit -m "feat(trending): add trending service (all/movies/tv/people × day/week)"
```

---

### Task 31: README + CLAUDE.md updates for Phase 4

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

- [ ] **Step 31.1: Add Phase 4 examples to README.md**

Insert a new section before `## Advanced Features` in `README.md`:

```markdown
### Genres

```typescript
const movieGenres = await client.genres.movies();
const tvGenres = await client.genres.tv();
```

### Configuration

```typescript
const config = await client.configuration.details();
// config.images.secureBaseUrl + size + filePath builds a poster URL
const countries = await client.configuration.countries();
const languages = await client.configuration.languages();
```

### Trending

```typescript
const trending = await client.trending.all('day');
const trendingMovies = await client.trending.movies('week');
const trendingTv = await client.trending.tv('day');
const trendingPeople = await client.trending.people('week');
```
```

- [ ] **Step 31.2: Update CLAUDE.md service list**

In `CLAUDE.md`, find the "Service Modules" subsection and replace it with:

```markdown
- **Service Modules**:
  - `src/movies/movies.ts` - Movie-related API endpoints
  - `src/people/people.ts` - People-related API endpoints
  - `src/tv/tv.ts` - TV-related API endpoints
  - `src/genres/genres.ts` - Genre lookup endpoints
  - `src/configuration/configuration.ts` - TMDB configuration (image base URLs, countries, languages, etc.)
  - `src/trending/trending.ts` - Trending content endpoints
```

- [ ] **Step 31.3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document genres, configuration, and trending services"
```

---

### Task 32: Phase 4 verification & PR

- [ ] **Step 32.1: Lint, types, tests**

```bash
npm run lint
npm run check-types
npm test
```

Expected: all PASS.

- [ ] **Step 32.2: Push + open PR 4**

```bash
git push
gh pr create --base main --head feat/breadth-expansion --title "feat: breadth-expansion phase 4 — lookup services" --body "$(cat <<'EOF'
## Summary
Adds three new top-level services:
- `client.genres` — `movies()`, `tv()`
- `client.configuration` — `details()`, `countries()`, `languages()`, `jobs()`, `primaryTranslations()`, `timezones()`
- `client.trending` — `all(window)`, `movies(window)`, `tv(window)`, `people(window)` where `window: 'day' | 'week'`

Phase 4 of the breadth-expansion design.

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run check-types` passes
- [ ] `npm test` passes
- [ ] README documents new services

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Phase 5 — Search & Discover (PR 5)

### Task 33: `Search` service skeleton + `multi`

**Files:**
- Create: `src/search/search.ts`
- Create: `src/search/types/Search.ts`
- Create: `src/search/__tests__/search.spec.ts`
- Modify: `src/index.ts`

- [ ] **Step 33.1: Define types**

Create `src/search/types/Search.ts`:

```ts
import type { Movie } from '../../movies/types/MovieCast';
import type { TvShow } from '../../tv/types/TvShow';
import type { Person } from '../../people/types/Person';
import type { Paginated } from '../../utils/types';

export interface BaseSearchOptions {
  page?: number;
  includeAdult?: boolean;
}

export interface MovieSearchOptions extends BaseSearchOptions {
  region?: string;
  year?: number;
  primaryReleaseYear?: number;
}

export interface TvSearchOptions extends BaseSearchOptions {
  firstAirDateYear?: number;
}

export type PeopleSearchOptions = BaseSearchOptions;

export interface KeywordResult {
  id: number;
  name: string;
}

export interface CompanyResult {
  id: number;
  logoPath: string | null;
  name: string;
  originCountry: string;
}

export interface CollectionResult {
  id: number;
  name: string;
  posterPath: string | null;
  backdropPath: string | null;
}

export type MultiSearchResult =
  | (Movie & { mediaType: 'movie' })
  | (TvShow & { mediaType: 'tv' })
  | (Person & { mediaType: 'person' });

export type MultiSearchResponse = Paginated<MultiSearchResult>;
export type MovieSearchResponse = Paginated<Movie>;
export type TvSearchResponse = Paginated<TvShow>;
export type PeopleSearchResponse = Paginated<Person>;
export type KeywordSearchResponse = Paginated<KeywordResult>;
export type CompanySearchResponse = Paginated<CompanyResult>;
export type CollectionSearchResponse = Paginated<CollectionResult>;
```

- [ ] **Step 33.2: Failing test for `multi`**

Create `src/search/__tests__/search.spec.ts`:

```ts
import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Search', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('multi', () => {
    it('hits search/multi with the query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.search.multi('Dune');
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('search/multi');
      expect(calledWith).toContain('query=Dune');
    });

    it('passes page and includeAdult when provided', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 2, results: [], totalPages: 5, totalResults: 100 });
      await tmdb.search.multi('Star Wars', { page: 2, includeAdult: true });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('query=Star+Wars');
      expect(calledWith).toContain('page=2');
      expect(calledWith).toContain('include_adult=true');
    });
  });
});
```

- [ ] **Step 33.3: Run, expect fail**

Run: `npx vitest run src/search/__tests__/search.spec.ts`
Expected: FAIL (module not found).

- [ ] **Step 33.4: Implement**

Create `src/search/search.ts`:

```ts
import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  BaseSearchOptions,
  MultiSearchResponse,
  MovieSearchOptions,
  MovieSearchResponse,
  TvSearchOptions,
  TvSearchResponse,
  PeopleSearchOptions,
  PeopleSearchResponse,
  KeywordSearchResponse,
  CompanySearchResponse,
  CollectionSearchResponse,
} from './types/Search';

function applyBaseSearchParams(url: ApiURL, query: string, opts?: BaseSearchOptions): void {
  url.appendParam('query', query);
  if (opts?.page) url.appendParam('page', opts.page.toString());
  if (opts?.includeAdult !== undefined) url.appendParam('include_adult', String(opts.includeAdult));
}

class Search {
  constructor(private apiClient: IApiClient) {}

  async multi(query: string, opts?: BaseSearchOptions): Promise<MultiSearchResponse> {
    const url = new ApiURL('search/multi');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<MultiSearchResponse>(url.toString());
  }

  async movies(query: string, opts?: MovieSearchOptions): Promise<MovieSearchResponse> {
    const url = new ApiURL('search/movie');
    applyBaseSearchParams(url, query, opts);
    if (opts?.region) url.appendParam('region', opts.region);
    if (opts?.year !== undefined) url.appendParam('year', opts.year.toString());
    if (opts?.primaryReleaseYear !== undefined) url.appendParam('primary_release_year', opts.primaryReleaseYear.toString());
    return this.apiClient.get<MovieSearchResponse>(url.toString());
  }

  async tv(query: string, opts?: TvSearchOptions): Promise<TvSearchResponse> {
    const url = new ApiURL('search/tv');
    applyBaseSearchParams(url, query, opts);
    if (opts?.firstAirDateYear !== undefined) url.appendParam('first_air_date_year', opts.firstAirDateYear.toString());
    return this.apiClient.get<TvSearchResponse>(url.toString());
  }

  async people(query: string, opts?: PeopleSearchOptions): Promise<PeopleSearchResponse> {
    const url = new ApiURL('search/person');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<PeopleSearchResponse>(url.toString());
  }

  async keywords(query: string, opts?: BaseSearchOptions): Promise<KeywordSearchResponse> {
    const url = new ApiURL('search/keyword');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<KeywordSearchResponse>(url.toString());
  }

  async companies(query: string, opts?: BaseSearchOptions): Promise<CompanySearchResponse> {
    const url = new ApiURL('search/company');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<CompanySearchResponse>(url.toString());
  }

  async collections(query: string, opts?: BaseSearchOptions): Promise<CollectionSearchResponse> {
    const url = new ApiURL('search/collection');
    applyBaseSearchParams(url, query, opts);
    return this.apiClient.get<CollectionSearchResponse>(url.toString());
  }
}

export default Search;
```

Wire it up in `src/index.ts`:

1. Add the import at the top:
   ```ts
   import Search from './search/search';
   ```
2. Add the field on `Client`:
   ```ts
   search: Search;
   ```
3. Construct it in the constructor (after `this.trending = ...`):
   ```ts
   this.search = new Search(this.apiClient);
   ```
4. Re-export the types at the bottom:
   ```ts
   export type {
     BaseSearchOptions,
     MovieSearchOptions,
     TvSearchOptions,
     PeopleSearchOptions,
     MultiSearchResult,
     MultiSearchResponse,
     MovieSearchResponse,
     TvSearchResponse,
     PeopleSearchResponse,
     KeywordSearchResponse,
     CompanySearchResponse,
     CollectionSearchResponse,
   } from './search/types/Search';
   ```

- [ ] **Step 33.5: Run, expect pass**

Run: `npx vitest run src/search/__tests__/search.spec.ts`
Expected: PASS.

- [ ] **Step 33.6: Commit**

```bash
git add src/search src/index.ts
git commit -m "feat(search): add search service with multi/movies/tv/people endpoints"
```

---

### Task 34: `Search.movies` and `Search.tv` tests

**Files:**
- Modify: `src/search/__tests__/search.spec.ts`

(Implementation is already in Task 33; this task just locks in test coverage for the more-specific options paths.)

- [ ] **Step 34.1: Failing tests**

Append to `src/search/__tests__/search.spec.ts`:

```ts
describe('movies', () => {
  it('hits search/movie with movie-specific options', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.movies('Dune', { year: 2024, primaryReleaseYear: 2024, region: 'US' });
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toContain('search/movie');
    expect(calledWith).toContain('query=Dune');
    expect(calledWith).toContain('year=2024');
    expect(calledWith).toContain('primary_release_year=2024');
    expect(calledWith).toContain('region=US');
  });
});

describe('tv', () => {
  it('hits search/tv with firstAirDateYear', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.tv('The Office', { firstAirDateYear: 2005 });
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toContain('search/tv');
    expect(calledWith).toContain('first_air_date_year=2005');
  });
});

describe('people', () => {
  it('hits search/person', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.people('Tilda Swinton');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/person'));
  });
});
```

- [ ] **Step 34.2: Run, expect pass**

Run: `npx vitest run src/search/__tests__/search.spec.ts`
Expected: PASS (implementation is already in place from Task 33).

- [ ] **Step 34.3: Commit**

```bash
git add src/search/__tests__/search.spec.ts
git commit -m "test(search): add coverage for movie-, tv-, people-specific search options"
```

---

### Task 35: `Search.keywords`, `companies`, `collections` tests

- [ ] **Step 35.1: Failing tests**

Append to `src/search/__tests__/search.spec.ts`:

```ts
describe('keywords', () => {
  it('hits search/keyword', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.keywords('dystopia');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/keyword'));
  });
});

describe('companies', () => {
  it('hits search/company', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.companies('A24');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/company'));
  });
});

describe('collections', () => {
  it('hits search/collection', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.search.collections('Bond');
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('search/collection'));
  });
});
```

- [ ] **Step 35.2: Run, expect pass**

Run: `npx vitest run src/search/__tests__/search.spec.ts`
Expected: PASS (implementation already in place from Task 33).

- [ ] **Step 35.3: Commit**

```bash
git add src/search/__tests__/search.spec.ts
git commit -m "test(search): cover keywords/companies/collections"
```

---

### Task 36: `Discover` service — types & query serialization helper

**Files:**
- Create: `src/discover/types/Discover.ts`
- Create: `src/discover/serializeQuery.ts`
- Create: `src/discover/__tests__/serializeQuery.spec.ts`

- [ ] **Step 36.1: Define types**

Create `src/discover/types/Discover.ts`:

```ts
import type { Movie } from '../../movies/types/MovieCast';
import type { TvShow } from '../../tv/types/TvShow';
import type { Paginated } from '../../utils/types';

export type SortBy =
  | 'popularity.asc'
  | 'popularity.desc'
  | 'release_date.asc'
  | 'release_date.desc'
  | 'revenue.asc'
  | 'revenue.desc'
  | 'primary_release_date.asc'
  | 'primary_release_date.desc'
  | 'original_title.asc'
  | 'original_title.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'vote_count.asc'
  | 'vote_count.desc'
  | 'first_air_date.asc'
  | 'first_air_date.desc';

export interface BaseDiscoverQuery {
  page?: number;
  sortBy?: SortBy;
  language?: string;
  region?: string;
  withGenres?: number[] | string;
  withoutGenres?: number[] | string;
  withKeywords?: number[] | string;
  withoutKeywords?: number[] | string;
  withCompanies?: number[] | string;
  withWatchProviders?: number[] | string;
  watchRegion?: string;
  withRuntimeGte?: number;
  withRuntimeLte?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
  voteCountGte?: number;
  voteCountLte?: number;
  withOriginalLanguage?: string;
  includeAdult?: boolean;
  includeVideo?: boolean;
}

export interface MovieDiscoverQuery extends BaseDiscoverQuery {
  primaryReleaseYear?: number;
  primaryReleaseDateGte?: string;
  primaryReleaseDateLte?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  year?: number;
  withPeople?: number[] | string;
  withReleaseType?: number;
  certificationCountry?: string;
  certification?: string;
  certificationLte?: string;
  certificationGte?: string;
}

export interface TvDiscoverQuery extends BaseDiscoverQuery {
  firstAirDateYear?: number;
  firstAirDateGte?: string;
  firstAirDateLte?: string;
  airDateGte?: string;
  airDateLte?: string;
  timezone?: string;
  withNetworks?: number[] | string;
  withStatus?: string;
  withType?: string;
  includeNullFirstAirDates?: boolean;
  screenedTheatrically?: boolean;
}

export type DiscoverMoviesResponse = Paginated<Movie>;
export type DiscoverTvResponse = Paginated<TvShow>;
```

- [ ] **Step 36.2: Failing tests for the serializer**

Create `src/discover/__tests__/serializeQuery.spec.ts`:

```ts
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
```

- [ ] **Step 36.3: Run, expect fail**

Run: `npx vitest run src/discover/__tests__/serializeQuery.spec.ts`
Expected: FAIL (module not found).

- [ ] **Step 36.4: Implement the serializer**

Create `src/discover/serializeQuery.ts`:

```ts
import ApiURL from '../utils/apiURL';
import { camelToSnakeCase } from '../utils/caseConversion';

export function serializeDiscoverQuery(url: ApiURL, query?: Record<string, unknown>): void {
  if (!query) return;
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    const snakeKey = camelToSnakeCase(key);
    if (Array.isArray(value)) {
      url.appendParam(snakeKey, value.map((v) => String(v)).join(','));
      continue;
    }
    if (typeof value === 'boolean') {
      url.appendParam(snakeKey, value ? 'true' : 'false');
      continue;
    }
    url.appendParam(snakeKey, String(value));
  }
}
```

- [ ] **Step 36.5: Run, expect pass**

Run: `npx vitest run src/discover/__tests__/serializeQuery.spec.ts`
Expected: PASS.

- [ ] **Step 36.6: Commit**

```bash
git add src/discover/types src/discover/serializeQuery.ts src/discover/__tests__/serializeQuery.spec.ts
git commit -m "feat(discover): add types and query serializer"
```

---

### Task 37: `Discover` service — `movies()`

**Files:**
- Create: `src/discover/discover.ts`
- Create: `src/discover/__tests__/discover.spec.ts`
- Modify: `src/index.ts`

- [ ] **Step 37.1: Failing tests**

Create `src/discover/__tests__/discover.spec.ts`:

```ts
import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Discover', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  describe('movies', () => {
    it('hits discover/movie with no query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.movies();
      expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('discover/movie'));
    });

    it('serializes a typed query', async () => {
      vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
      await tmdb.discover.movies({
        sortBy: 'popularity.desc',
        withGenres: [28, 12],
        primaryReleaseYear: 2026,
        voteAverageGte: 7,
        page: 2,
      });
      const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
      expect(calledWith).toContain('sort_by=popularity.desc');
      expect(calledWith).toContain('with_genres=28%2C12');
      expect(calledWith).toContain('primary_release_year=2026');
      expect(calledWith).toContain('vote_average_gte=7');
      expect(calledWith).toContain('page=2');
    });
  });
});
```

- [ ] **Step 37.2: Run, expect fail**

Run: `npx vitest run src/discover/__tests__/discover.spec.ts`
Expected: FAIL (module not found).

- [ ] **Step 37.3: Implement**

Create `src/discover/discover.ts`:

```ts
import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import { serializeDiscoverQuery } from './serializeQuery';
import type {
  MovieDiscoverQuery,
  TvDiscoverQuery,
  DiscoverMoviesResponse,
  DiscoverTvResponse,
} from './types/Discover';

class Discover {
  constructor(private apiClient: IApiClient) {}

  async movies(query?: MovieDiscoverQuery): Promise<DiscoverMoviesResponse> {
    const url = new ApiURL('discover/movie');
    serializeDiscoverQuery(url, query as Record<string, unknown> | undefined);
    return this.apiClient.get<DiscoverMoviesResponse>(url.toString());
  }

  async tv(query?: TvDiscoverQuery): Promise<DiscoverTvResponse> {
    const url = new ApiURL('discover/tv');
    serializeDiscoverQuery(url, query as Record<string, unknown> | undefined);
    return this.apiClient.get<DiscoverTvResponse>(url.toString());
  }
}

export default Discover;
```

Wire it up in `src/index.ts`:

1. Add the import at the top:
   ```ts
   import Discover from './discover/discover';
   ```
2. Add the field on `Client`:
   ```ts
   discover: Discover;
   ```
3. Construct it in the constructor (after `this.search = ...`):
   ```ts
   this.discover = new Discover(this.apiClient);
   ```
4. Re-export the types at the bottom:
   ```ts
   export type {
     SortBy,
     BaseDiscoverQuery,
     MovieDiscoverQuery,
     TvDiscoverQuery,
     DiscoverMoviesResponse,
     DiscoverTvResponse,
   } from './discover/types/Discover';
   ```

- [ ] **Step 37.4: Run, expect pass**

Run: `npx vitest run src/discover/__tests__/discover.spec.ts`
Expected: PASS.

- [ ] **Step 37.5: Commit**

```bash
git add src/discover/discover.ts src/discover/__tests__/discover.spec.ts src/index.ts
git commit -m "feat(discover): add discover service with movies() and tv()"
```

---

### Task 38: `Discover.tv` test coverage

- [ ] **Step 38.1: Failing test**

Append to `src/discover/__tests__/discover.spec.ts`:

```ts
describe('tv', () => {
  it('hits discover/tv with no query', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.discover.tv();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('discover/tv'));
  });

  it('serializes a TV-specific query', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ page: 1, results: [], totalPages: 1, totalResults: 0 });
    await tmdb.discover.tv({
      sortBy: 'first_air_date.desc',
      withNetworks: [213],
      firstAirDateYear: 2025,
      includeNullFirstAirDates: false,
    });
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toContain('sort_by=first_air_date.desc');
    expect(calledWith).toContain('with_networks=213');
    expect(calledWith).toContain('first_air_date_year=2025');
    expect(calledWith).toContain('include_null_first_air_dates=false');
  });
});
```

- [ ] **Step 38.2: Run, expect pass**

Run: `npx vitest run src/discover/__tests__/discover.spec.ts`
Expected: PASS (implementation already in place from Task 37).

- [ ] **Step 38.3: Commit**

```bash
git add src/discover/__tests__/discover.spec.ts
git commit -m "test(discover): add coverage for discover.tv"
```

---

### Task 39: E2E smoke tests for headline endpoints

**Files:**
- Create: `tests/e2e/breadth-expansion.test.ts`

The e2e suite uses `tests/e2e/**/*.test.ts` (per `vitest.e2e.config.ts`) with a shared setup in `tests/e2e/setup.ts` that loads `.env.test` and throws if `TMDB_API_KEY` is missing. Match that convention: don't use `it.skip` patterns — the setup guarantees the key exists.

Smoke tests cover the four headline new endpoints — `search.multi`, `discover.movies`, `trending.all`, `configuration.details`. Each makes exactly one real API call and asserts a structural minimum. Do not snapshot — TMDB data is mutable.

- [ ] **Step 39.1: Create the e2e file**

Create `tests/e2e/breadth-expansion.test.ts`:

```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { Client } from '../../src/index';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Breadth Expansion E2E', () => {
  let client: Client;

  beforeAll(() => {
    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is required for e2e tests');
    }
    client = new Client({ apiKey: process.env.TMDB_API_KEY });
  });

  describe('search.multi', () => {
    it('returns results for a known query', async () => {
      const response = await client.search.multi('Dune');
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('discover.movies', () => {
    it('returns results when sorted by popularity', async () => {
      const response = await client.discover.movies({ sortBy: 'popularity.desc' });
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('trending.all', () => {
    it('returns daily trending content', async () => {
      const response = await client.trending.all('day');
      expect(response).toBeDefined();
      expect(response.results).toBeInstanceOf(Array);
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('configuration.details', () => {
    it('returns image base urls', async () => {
      const response = await client.configuration.details();
      expect(typeof response.images.secureBaseUrl).toBe('string');
      expect(response.images.secureBaseUrl.length).toBeGreaterThan(0);
      expect(response.images.posterSizes).toBeInstanceOf(Array);
    });
  });
});
```

- [ ] **Step 39.2: Run e2e (requires a real `TMDB_API_KEY` in `.env.test` or env)**

Run: `npm run test:e2e`
Expected: 4 new tests PASS. If you don't have an API key locally, this will throw from `beforeAll` — that's expected behaviour matching the existing e2e suite. CI runs e2e with the secret.

- [ ] **Step 39.3: Commit**

```bash
git add tests/e2e/breadth-expansion.test.ts
git commit -m "test(e2e): smoke test search/discover/trending/configuration"
```

---

### Task 40: README documentation for Phase 5

**Files:**
- Modify: `README.md`

- [ ] **Step 40.1: Add Search and Discover examples**

Insert before `## Advanced Features` (after the Phase 4 additions from Task 31):

```markdown
### Search

```typescript
const results = await client.search.multi('Dune', { page: 1 });
const movies = await client.search.movies('The Matrix', { year: 1999 });
const tv = await client.search.tv('The Office', { firstAirDateYear: 2005 });
const people = await client.search.people('Tilda Swinton');
```

For `multi`, results carry a `mediaType` discriminator:

```typescript
const results = await client.search.multi('Foo');
for (const r of results.results) {
  if (r.mediaType === 'movie') console.log(r.title);
  else if (r.mediaType === 'tv') console.log(r.name);
  else console.log(r.name); // person
}
```

### Discover

```typescript
const popular2026 = await client.discover.movies({
  sortBy: 'popularity.desc',
  withGenres: [28, 12],
  primaryReleaseYear: 2026,
  voteAverageGte: 7,
  page: 2,
});

const recentDrama = await client.discover.tv({
  sortBy: 'first_air_date.desc',
  withGenres: [18],
  firstAirDateYear: 2025,
});
```

Number arrays are joined with `,` (TMDB's AND semantics). To express OR, pass the value as a `|`-joined string: `withGenres: '28|12'`.
```

- [ ] **Step 40.2: Commit**

```bash
git add README.md
git commit -m "docs: document search and discover services"
```

---

### Task 41: CLAUDE.md update for Phase 5

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 41.1: Update the service list**

Find the "Service Modules" subsection in `CLAUDE.md` and replace it with:

```markdown
- **Service Modules**:
  - `src/movies/movies.ts` - Movie-related API endpoints
  - `src/people/people.ts` - People-related API endpoints
  - `src/tv/tv.ts` - TV-related API endpoints
  - `src/search/search.ts` - Search endpoints (multi, movies, tv, people, keywords, companies, collections)
  - `src/discover/discover.ts` - Discover endpoints with typed query objects
  - `src/genres/genres.ts` - Genre lookup endpoints
  - `src/configuration/configuration.ts` - TMDB configuration (image base URLs, countries, languages, etc.)
  - `src/trending/trending.ts` - Trending content endpoints
```

- [ ] **Step 41.2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: note new services in CLAUDE.md"
```

---

### Task 42: Phase 5 verification & final PR

- [ ] **Step 42.1: Full verification**

```bash
npm run lint
npm run check-types
npm test
npm run validate-package
```

Expected: all PASS. `validate-package` confirms types/exports are correct for publish.

- [ ] **Step 42.2: Push + open PR 5**

```bash
git push
gh pr create --base main --head feat/breadth-expansion --title "feat: breadth-expansion phase 5 — search and discover" --body "$(cat <<'EOF'
## Summary
Adds the two flagship new services:
- `client.search` — `multi`, `movies`, `tv`, `people`, `keywords`, `companies`, `collections`
- `client.discover` — `movies(query?)`, `tv(query?)` with strongly-typed query objects

Plus README + CLAUDE.md docs and e2e smoke tests for the headline new endpoints.

Final phase of the breadth-expansion design. Once merged, semantic-release ships a minor version bump.

## Test plan
- [ ] `npm run lint` passes
- [ ] `npm run check-types` passes
- [ ] `npm test` passes
- [ ] `npm run validate-package` passes
- [ ] E2E smoke tests pass with a real API key

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Done

When all 5 PRs are merged to `main`, semantic-release auto-publishes the next minor (`1.10.0`). The branch `feat/breadth-expansion` can be deleted after the final merge.
