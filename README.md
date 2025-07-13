# TMDBrJS

[![npm version](https://badge.fury.io/js/tmdbrjs.svg)](https://www.npmjs.com/package/tmdbrjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/tmdbrjs.svg)](https://nodejs.org)

TMDBrJS is a TypeScript library for interacting with [The Movie Database (TMDB)](https://www.themoviedb.org/) API. It provides a clean, typed interface with automatic camelCase conversion of API responses.

## Features

- 🎯 **Full TypeScript support** with comprehensive type definitions
- 🔄 **Automatic camelCase conversion** of TMDB API responses
- 📦 **ESM and CommonJS** support for all JavaScript environments
- 🎬 **Complete movie endpoints** including popular, top-rated, and detailed movie information
- 👥 **People endpoints** with credits and media information
- 🔍 **Advanced append_to_response** support with type safety
- ⚡ **Lightweight** with minimal dependencies
- 🌐 **Configurable language** support

## Disclaimer

**Important Notice:**

This package is a personal project and may not be actively maintained or thoroughly documented. Use it at your own risk. Contributions are welcome, but please note that there might be limited support and updates.

## Requirements

- Node.js 18 or higher
- TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

## Installation

```bash
# npm
npm install tmdbrjs

# yarn
yarn add tmdbrjs

# pnpm
pnpm add tmdbrjs
```

## Getting Started

### Basic Setup

```typescript
import { Client } from 'tmdbrjs';

const client = new Client({ apiKey: 'YOUR_API_KEY' });
```

### With Configuration Options

```typescript
const client = new Client({ 
  apiKey: 'YOUR_API_KEY',
  language: 'en-US', // Optional: defaults to 'en-US'
  version: '3', // Optional: API version, defaults to '3'
  baseUrl: 'https://api.themoviedb.org' // Optional: custom base URL
});
```

### Error Handling

```typescript
try {
  const movie = await client.movies.getById('550');
  console.log(movie.title); // Response is automatically camelCased
} catch (error) {
  if (error.message === 'Invalid API key') {
    console.error('Please check your API key');
  } else {
    console.error('Error fetching movie:', error.message);
  }
}
```

## API Reference

### Movies

#### Get Popular Movies
```typescript
const popularMovies = await client.movies.getPopular(1); // page number (optional)
```

#### Get Top Rated Movies
```typescript
const topRated = await client.movies.getTopRated();
```

#### Get Movie by ID
```typescript
const movie = await client.movies.getById('550');

// With append_to_response (type-safe)
const movieWithCredits = await client.movies.getById('550', {
  include: ['credits', 'videos', 'images', 'recommendations', 'keywords']
});
```

#### Get Similar Movies
```typescript
const similar = await client.movies.getSimilar('550');
```

#### Get Movie Credits
```typescript
const credits = await client.movies.getCredits('550');
```

### People

#### Get Popular People
```typescript
const popularPeople = await client.people.getPopular(1); // page number (optional)
```

#### Get Person by ID
```typescript
const person = await client.people.getById('287');

// With append_to_response
const personWithCredits = await client.people.getById('287', {
  include: ['movieCredits', 'tvCredits', 'externalIds', 'translations'] // Note: camelCase is automatically converted
});
```

#### Get Person Movie Credits
```typescript
const movieCredits = await client.people.getMovieCredits('287');
```

#### Get Person TV Credits
```typescript
const tvCredits = await client.people.getTvCredits('287');
```

#### Get Person Combined Credits
```typescript
const combinedCredits = await client.people.getCombinedCredits('287');
```

#### Get Person Images
```typescript
const images = await client.people.getImages('287');
```

## Advanced Features

### Type-Safe append_to_response

The library provides full TypeScript support for TMDB's append_to_response feature:

```typescript
// The response type automatically includes the appended data
const movieWithExtras = await client.movies.getById('550', {
  include: ['credits', 'videos', 'images', 'recommendations']
});

// TypeScript knows about the appended properties
console.log(movieWithExtras.credits.cast);
console.log(movieWithExtras.videos.results);
console.log(movieWithExtras.recommendations.results);
```

#### Available append_to_response Options

**Movies:**
- `credits` - Cast and crew information
- `videos` - Trailers, teasers, clips
- `images` - Backdrops and posters
- `reviews` - User reviews
- `similar` - Similar movies
- `recommendations` - Recommended movies
- `keywords` - Movie keywords
- `translations` - Title and overview translations
- `releaseDates` - Release dates by country
- `externalIds` - External IDs (IMDb, etc.)
- `accountStates` - User's account states (favorite, rated, watchlist)

**People:**
- `movieCredits` - Movie appearances
- `tvCredits` - TV show appearances
- `combinedCredits` - All credits combined
- `images` - Profile images
- `externalIds` - External IDs (IMDb, social media)
- `taggedImages` - Images the person is tagged in
- `translations` - Biography translations

### Automatic Case Conversion

All API responses are automatically converted from snake_case to camelCase:

```typescript
const movie = await client.movies.getById('550');

// TMDB returns: release_date, vote_average, backdrop_path
// TMDBrJS provides: releaseDate, voteAverage, backdropPath
console.log(movie.releaseDate);
console.log(movie.voteAverage);
console.log(movie.backdropPath);
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- TMDB API key for running tests

### Setup

1. Clone the repository:
```bash
git clone https://github.com/foestauf/TMDBrJS.git
cd TMDBrJS
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.test` file in the root directory with your TMDB API key:
```bash
TMDB_API_KEY=your_api_key_here
```

### Available Scripts

```bash
pnpm build          # Build both ESM and CommonJS versions
pnpm dev           # Watch mode for development
pnpm test          # Run unit tests with coverage
pnpm test:e2e      # Run end-to-end tests
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint issues
pnpm format        # Format code with Prettier
pnpm check-types   # Type check without building
```

### Running Tests

The project uses Vitest for testing. There are two types of tests:

1. Unit tests:
```bash
pnpm test
```

2. End-to-end tests:
```bash
pnpm test:e2e
```

For e2e tests, you can provide the API key in two ways:
- Set it in the `.env.test` file
- Set it as an environment variable: `TMDB_API_KEY=your_api_key_here pnpm test:e2e`

### Code Quality

- Run linting: `pnpm lint`
- Fix linting issues: `pnpm lint:fix`
- Type checking: `pnpm check-types`

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Use `pnpm commit` to commit changes with commitizen.

## CI/CD

The project uses GitHub Actions for continuous integration. The CI pipeline:

1. Runs on Node.js 18.x, 20.x, and 21.x
2. Performs the following checks:
   - Linting
   - Type checking
   - Unit tests
   - End-to-end tests
   - Coverage reporting (via Codecov)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run linting (`pnpm lint`)
6. Commit your changes using conventional commits (`pnpm commit`)
7. Push to your branch
8. Open a Pull Request

## Links

- [NPM Package](https://www.npmjs.com/package/tmdbrjs)
- [GitHub Repository](https://github.com/foestauf/TMDBrJS)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Report Issues](https://github.com/foestauf/TMDBrJS/issues)

## License

TMDBrJS is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.