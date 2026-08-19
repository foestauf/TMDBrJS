# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TMDBrJS is a TypeScript library for interacting with The Movie Database (TMDB) API. It provides a clean, typed interface for fetching movie and people data with automatic camelCase conversion.

## Development Commands

### Build
```bash
npm run build          # Build the ESM bundle with tsdown to dist/
npm run dev           # Watch mode for development
npm run check-types   # Type check without emitting files
npm run validate-package  # Validate package exports and types
npm run test:package      # Smoke test that the built bundle loads from ESM and CJS
```

### Testing
```bash
npm test              # Run tests with coverage (vitest)
```

### Linting and Formatting
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
```

### Git Workflow
```bash
npm run commit        # Use commitizen for conventional commits
```

## Architecture

### Core Structure
- **Client Entry Point**: `src/index.ts` - Main TmdbClient class that initializes API client and service modules
- **Service Modules**:
  - `src/movies/movies.ts` - Movie-related API endpoints
  - `src/people/people.ts` - People-related API endpoints
  - `src/tv/tv.ts` - TV-related API endpoints
  - `src/search/search.ts` - Search endpoints (multi, movies, tv, people, keywords, companies, collections)
  - `src/discover/discover.ts` - Discover endpoints with typed query objects
  - `src/genres/genres.ts` - Genre lookup endpoints
  - `src/configuration/configuration.ts` - TMDB configuration (image base URLs, countries, languages, etc.)
  - `src/trending/trending.ts` - Trending content endpoints
- **Utilities**:
  - `src/utils/apiURL.ts` - URL builder for TMDB API
  - `src/utils/applyCaseMiddleware.ts` - Transforms API responses from snake_case to camelCase

### Key Design Patterns
1. **Service Pattern**: Each API domain (movies, people) has its own service class
2. **Dependency Injection**: Services receive the API client via constructor
3. **Generic Types**: Methods use TypeScript generics for type-safe append_to_response options
4. **Middleware Pattern**: Response transformation happens automatically via applyCaseMiddleware

### API Client Architecture
The main client (`TmdbClient`) creates an HTTP client with:
- Bearer token authentication
- Automatic error handling for 401 (invalid API key)
- JSON response parsing
- CamelCase transformation of response data

### Testing Strategy
- Test files are co-located with source files in `__tests__` directories
- Uses Vitest for testing with coverage reporting
- Test files follow the pattern `*.spec.ts`

## Important Implementation Details

1. **ESM Module**: This is a pure ESM package (type: "module" in package.json)
2. **Node Version**: Requires Node.js 22.12+
3. **Build System**: Uses tsdown (Rust-powered bundler)
4. **Build Output**: A single ESM bundle in `dist/` — `index.mjs` with `index.d.mts` types. **Do not reintroduce a CommonJS build.** The package is ESM-only as of v2.0.0; CommonJS consumers load it through Node's `require(esm)`, which is why `engines.node` is `>=22.12` and why `attw` is run with `--ignore-rules cjs-resolves-to-esm` (that warning describes the intended trade-off, not a defect).
5. **No top-level await**: `require(esm)` only works on a synchronous module graph. A top-level await anywhere in the bundle or its dependencies silently breaks every CommonJS consumer, so `scripts/smoke-test.mjs` asserts both load paths in separate processes (the isolation matters — within one process an earlier `import()` caches the module and a later `require()` never exercises the sync path).
6. **Package Validation**: Automated validation with @arethetypeswrong/cli and publint
7. **Case Conversion**: All TMDB API responses are automatically converted from snake_case to camelCase
8. **Error Handling**: API errors are caught and re-thrown with descriptive messages
9. **Type Safety**: Extensive use of TypeScript generics for append_to_response functionality

## Release Process
- Uses semantic-release for automated versioning and publishing
- Commits must follow conventional commit format
- Releases happen automatically from the main branch via GitHub Actions