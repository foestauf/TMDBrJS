````markdown
# TMDBrJS

TMDBrJS is a JavaScript library for interacting with the TMDB API.

## Disclaimer

**Important Notice:**

This package is a personal project and may not be actively maintained or thoroughly documented. Use it at your own risk. Contributions are welcome, but please note that there might be limited support and updates.

## Installation

To use TMDBrJS, you need to have Node.js installed. Then, you can install the library using npm:

```bash
npm install tmdbrjs
```
````

## Usage

To instantiate the client, you need to provide your TMDB API key. You can obtain an API key by creating an account on the TMDB website.

```javascript
const TMDBr = require('tmdbrjs');

const apiKey = 'YOUR_API_KEY';
const client = new TMDBr(apiKey);
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

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

TMDBrJS is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
