import Movies from './movies/movies';
import People from './people/people';
import { camelCase } from 'change-case';
import { applyCaseMiddleware } from './utils/applyCaseMiddleware';
import { Person } from './people/types/Person';
import { MovieCredits } from './people/types/MovieCredit';

interface IConfig {
  apiKey: string;
}

export interface IApiClient {
  get: <T = unknown>(url: string, options?: RequestInit) => Promise<T>;
}

class Client {
  public apiClient: IApiClient;
  movies: Movies;
  people: People;

  constructor(private config: IConfig) {
    this.apiClient = {
      get: async <T = unknown>(pathname: string, options: RequestInit = {}) => {
        if (!this.config.apiKey) {
          throw new Error('No API key provided');
        }
        const url = new URL(pathname, 'https://api.themoviedb.org/3/');
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key');
          }
          throw new Error(`HTTP error! status: ${String(response.status)}`);
        }

        let data: unknown = await response.json();
        data = applyCaseMiddleware(data, camelCase);
        return data as T;
      },
    };
    this.movies = new Movies(this.apiClient);

    this.people = new People(this.apiClient);
  }
}

export { Client };
export type { Person, MovieCredits };
