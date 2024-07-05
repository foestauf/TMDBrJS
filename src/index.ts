import Movies from './movies/movies';
import People from './people/people';
import { camelCase } from 'change-case';
import { applyCaseMiddleware } from './utils/applyCaseMiddleware';
interface IConfig {
  apiKey: string;
}

export interface IApiClient {
  get: <T = unknown>(url: string, options?: RequestInit | undefined) => Promise<T>;
}

class TmdbClient {
  public apiClient: IApiClient;
  movies: Movies;
  people: People;

  constructor(private config: IConfig) {
    this.apiClient = {
      get: async <T = unknown>(pathname: string, options: RequestInit = {}) => {
        const url = new URL(pathname, 'https://api.themoviedb.org/3');
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            ...(options && options.headers),
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        data = applyCaseMiddleware(data, camelCase);
        return data as T;
      },
    };
    this.movies = new Movies(this.apiClient);

    this.people = new People(this.apiClient);
  }
}

export default TmdbClient;
