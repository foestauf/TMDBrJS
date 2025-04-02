# TMDBrJS

TMDBrJS is a JavaScript library for interacting with the [TMDB](https://www.themoviedb.org/) API.

## Disclaimer

**Important Notice:**

This package is a personal project and may not be actively maintained or thoroughly documented. Use it at your own risk. Contributions are welcome, but please note that there might be limited support and updates.

## Installation

To use TMDBrJS, you need to have Node.js installed. Then, you can install the library using npm:

```bash
npm install tmdbrjs
```

## Usage

To instantiate the client, you need to provide your TMDB API key. You can obtain an API key by creating an account on the TMDB website.

```javascript
import { Client } from 'tmdbrjs';

const apiKey = 'YOUR_API_KEY';
const client = new Client({ apiKey });
```

## Examples

Here are a few examples of how to use the TMDBrJS library:

### Get movie details

```javascript
const movieId = 12345;
const movie = await client.movies.getById(movieId);
console.log(movie);
```

### Get person details

```javascript
const personId = 67890;
const results = await client.people.getById(personId);
console.log(results);
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- TMDB API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TMDBrJS.git
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

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests and linting
4. Commit your changes using conventional commits
5. Push your changes and create a pull request

## License

TMDBrJS is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
