# TMDB Breadth Expansion — Design

**Date:** 2026-05-15
**Status:** Approved
**Author:** Robert McKee (via Claude)

## Goal

Bring TMDBrJS from a narrow Movies+People+Tv wrapper to a library that covers the TMDB endpoints consumers actually reach for first: search, discover, trending, genres, and configuration. Simultaneously, bring `Movies` and `People` up to parity with the existing `Tv` service in both endpoint coverage and internal style.

## Non-Goals

These are deliberately out of scope and will be addressed in separate efforts:

- **Authentication flows** — v3 session creation, v4 user auth, account state mutations, list CRUD, rating/favouriting. Needs an auth model design of its own.
- **Phase 2 breadth** — Find-by-external-id, top-level `Companies`/`Networks`/`Collections`/`Keywords` services, Certifications, Credit-by-id endpoint. Useful but lower demand; defer.
- **Per-call option overrides** — `language`, `region`, `appendToResponse` as per-call params (rather than client-level). Known quality issue but invasive across every method signature; address as a focused refactor.
- **Operational hardening** — retry/backoff on 429, request timeouts, ETag/conditional GETs.
- **OpenAPI codegen** — explicitly the alternative we rejected; out of scope for this expansion.
- **Behavioural bug fixes** — each gets its own PR:
  - `MovieCast.ts` has snake_case keys in TS types (`cast_id`, `iso_3166_1`, `iso_639_1`, `english_name`) where the middleware actually delivers camelCase at runtime.
  - `SimilarMovies` type nests under `similarMovies` rather than `similar`, mismatching the `append_to_response` map.
  - `ApiURL` hardcodes `https://api.themoviedb.org/3/`, ignoring the configurable `baseUrl` on `Client`.

## Scope — New Endpoints

### New top-level services

| Service | Methods | Endpoints |
|---|---|---|
| `client.search` | `multi(query, opts?)`, `movies(query, opts?)`, `tv(query, opts?)`, `people(query, opts?)`, `keywords(query, opts?)`, `companies(query, opts?)`, `collections(query, opts?)` | `/search/multi`, `/search/movie`, `/search/tv`, `/search/person`, `/search/keyword`, `/search/company`, `/search/collection` |
| `client.discover` | `movies(query?)`, `tv(query?)` | `/discover/movie`, `/discover/tv` |
| `client.trending` | `all(window)`, `movies(window)`, `tv(window)`, `people(window)` where `window: 'day' \| 'week'` | `/trending/{media_type}/{time_window}` |
| `client.genres` | `movies()`, `tv()` | `/genre/movie/list`, `/genre/tv/list` |
| `client.configuration` | `details()`, `countries()`, `languages()`, `jobs()`, `primaryTranslations()`, `timezones()` | `/configuration`, `/configuration/countries`, `/configuration/languages`, `/configuration/jobs`, `/configuration/primary_translations`, `/configuration/timezones` |

### Movies parity (bringing Movies up to Tv's level)

Add: `getNowPlaying(page?)`, `getUpcoming(page?)`, `getLatest()`, `getImages(id)`, `getVideos(id)`, `getReviews(id, page?)`, `getRecommendations(id, page?)`, `getKeywords(id)`, `getReleaseDates(id)`, `getTranslations(id)`, `getExternalIds(id)`, `getAlternativeTitles(id)`, `getWatchProviders(id)`, `getLists(id, page?)`, `getChanges(id, startDate?, endDate?, page?)`, `getAccountStates(id)`.

Existing Movies methods get pagination params where missing (`getPopular` already has one; `getTopRated`, `getSimilar` do not). All Movies URL building moves to `ApiURL` (currently uses string concatenation in `getPopular`).

`Movies.getMovieCredits` is a duplicate of `Movies.getCredits` — mark `getMovieCredits` `@deprecated` pointing to `getCredits`. (Keeping the symbol for backward compatibility; will be removed in a future major.)

### People parity

Add: `getLatest()`, `getChanges(id, startDate?, endDate?, page?)`, `getExternalIds(id)`, `getTranslations(id)`.

## Architecture

### Service shape

All new services follow the established pattern:

```ts
class NewService extends BaseService<TAppendOptions, TAppendResponseMap> {
  // or just `constructor(apiClient: IApiClient)` via BaseService when no append_to_response
  async method(...): Promise<TypedShape> {
    const url = new ApiURL('endpoint/path');
    if (param) url.appendParam('key', String(param));
    return this.apiClient.get<TypedShape>(url.toString());
  }
}
```

- **URL building:** always via `ApiURL`. No string concat in new code.
- **Pagination:** `page?: number`. Omit the param when undefined (don't default to `1` in the call — let TMDB use its own default).
- **Append-to-response:** services that support it extend `BaseService` and provide a `TAppendResponseMap`; they expose `getById` via `getByIdWithAppendToResponse`.
- **Types:** co-located under `src/<service>/types/`. Continue current style (hand-rolled TypeScript interfaces). One file per logical grouping (e.g. `Search.ts`, `Discover.ts`).

### Shared types

Introduce one shared generic to replace the repetition of `{ page; results; totalPages; totalResults }`:

```ts
// src/utils/types.ts
export interface Paginated<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
```

New service paginated responses use `Paginated<T>` directly. Existing paginated types (`PopularMovies`, `PopularTvShows`, etc.) are left alone — switching them would be a breaking-shape change for consumers reading the type re-exports, and isn't worth bundling here. New code uses `Paginated<T>`; old code stays.

### Discover query design

`MovieDiscoverQuery` and `TvDiscoverQuery` are typed objects with camelCase fields covering every documented TMDB filter:

- Sort: `sortBy` (string-union of allowed sort keys).
- Filters: `withGenres`, `withoutGenres`, `withKeywords`, `withCompanies`, `withPeople` (movies only), `withNetworks` (tv only), `withWatchProviders`, `watchRegion`, `withRuntimeGte/Lte`, `voteAverageGte/Lte`, `voteCountGte/Lte`, `primaryReleaseYear`, `primaryReleaseDateGte/Lte`, `firstAirDateYear` (tv), etc.
- Arrays serialize as comma-joined (TMDB's "AND" semantics). No explicit "OR" helper yet — add only when a real use case appears.
- Numbers, strings, and booleans coerce to TMDB's expected wire format.
- Conversion path: query object → `camelToSnakeCase` for keys → `URLSearchParams` → URL. Reuses `caseConversion.ts`.

```ts
await client.discover.movies({
  sortBy: 'popularity.desc',
  withGenres: [28, 12],
  primaryReleaseYear: 2026,
  voteAverageGte: 7,
  page: 2,
});
```

The result type is `Paginated<Movie>` (or `Paginated<TvShow>`).

### Search query design

Search methods take a `query: string` (required) and an options object with `page?`, `includeAdult?`, `region?` (where applicable), `primaryReleaseYear?` (movie), `year?` (movie), `firstAirDateYear?` (tv). `multi` returns `Paginated<MultiSearchResult>` where `MultiSearchResult` is a discriminated union on `mediaType: 'movie' | 'tv' | 'person'`.

### Configuration

`configuration.details()` returns the TMDB image base URLs and size buckets — the data every consumer needs to build poster/backdrop URLs. Other configuration methods (`countries`, `languages`, etc.) return their respective arrays. These are typically called once at app startup and cached by the consumer; the library does not cache.

## Testing Strategy

- **Unit tests:** co-located `__tests__/*.spec.ts` alongside each new service. Mock `IApiClient` with a stub that captures URLs and returns canned JSON. Per method, assert:
  1. Correct URL path + query params.
  2. Response is returned and typed correctly.
  3. One error path (e.g. API error message propagation).
- **E2E tests:** add smoke tests for the headline new endpoints only — `search.multi`, `discover.movies`, `trending.all`, `configuration.details`. Keeps e2e fast and avoids burning through TMDB rate limits / requiring an API key for full coverage.
- **Existing tests:** must remain green. Existing service files are extended, not rewritten.

## Documentation

- Update `README.md` with examples for each new service (one block each, matching the existing style).
- Update `CLAUDE.md` if architecture notes need it (the service-pattern description still applies; just more services).
- No standalone docs site.

## Rollout

Single feature branch (`feat/breadth-expansion`) with PRs cut sequentially against it. Each PR is independently green (lint + types + unit tests). On the final merge, semantic-release ships a minor version bump (additive only).

**PR sequence:**

1. **Foundation** — `Paginated<T>` shared type, switch `Movies` to `ApiURL`, add pagination params to existing `Movies` methods, deprecate `Movies.getMovieCredits`.
2. **Movies parity** — the 16 new Movies methods + their types.
3. **People parity** — the 4 new People methods + their types.
4. **Lookup services** — `genres`, `configuration`, `trending`.
5. **Search & Discover** — the two big new services; isolated so review attention lands here.

Each PR follows the existing conventional-commit / semantic-release flow.

## Open Questions

None at design time. Implementation may surface TMDB API quirks (e.g. inconsistent param naming on some endpoints) that get handled inline.

## Future Work (explicit follow-ups, not commitments)

- Per-call `language`/`region`/`appendToResponse` overrides.
- v3 session + v4 user auth, account/list/rating endpoints.
- Retry/backoff and request timeout configuration.
- OpenAPI-driven codegen (rejected for now in favour of hand-rolled types).
- Type-bug clean-up pass (snake_case in `MovieCast.ts`, `SimilarMovies` nesting, `ApiURL` baseUrl).
- Migrate existing paginated types (`PopularMovies` etc.) to `Paginated<T>` in a major version.
