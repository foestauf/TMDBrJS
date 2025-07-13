# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TMDBrJS is a TypeScript library for interacting with The Movie Database (TMDB) API. It provides a clean, typed interface for fetching movie and people data with automatic camelCase conversion.

## Development Commands

### Build
```bash
npm run build          # Compile TypeScript to JavaScript in lib/
npm run dev           # Watch mode for development
npm run check-types   # Type check without emitting files
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
2. **Node Version**: Requires Node.js 18+
3. **Build Output**: TypeScript compiles to `lib/` directory with source maps and type definitions
4. **Case Conversion**: All TMDB API responses are automatically converted from snake_case to camelCase
5. **Error Handling**: API errors are caught and re-thrown with descriptive messages
6. **Type Safety**: Extensive use of TypeScript generics for append_to_response functionality

## Release Process
- Uses semantic-release for automated versioning and publishing
- Commits must follow conventional commit format
- Releases happen automatically from the main branch via GitHub Actions