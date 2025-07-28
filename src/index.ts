import Movies from './movies/movies';
import People from './people/people';
import Tv from './tv/tv';
import { camelCase } from 'change-case';
import { applyCaseMiddleware } from './utils/applyCaseMiddleware';
import { Person } from './people/types/Person';
import { MovieCredits } from './people/types/MovieCredit';
import { TvShow, TvCredits } from './tv/types/TvShow';

interface IConfig {
  apiKey: string;
  version?: string;
  baseUrl?: string;
  language?: string;
}

export interface IApiClient {
  get: <T = unknown>(url: string, options?: RequestInit) => Promise<T>;
}

class Client {
  public apiClient: IApiClient;
  movies: Movies;
  people: People;
  tv: Tv;
  private readonly version: string;
  private readonly baseUrl: string;
  private readonly language: string;

  constructor(private config: IConfig) {
    this.version = config.version ?? '3';
    this.baseUrl = config.baseUrl ?? 'https://api.themoviedb.org';
    this.language = config.language ?? 'en-US';

    this.apiClient = {
      get: async <T = unknown>(pathname: string, options: RequestInit = {}) => {
        if (!this.config.apiKey) {
          throw new Error('No API key provided');
        }
        const url = new URL(pathname, `${this.baseUrl}/${this.version}/`);
        url.searchParams.append('language', this.language);

        const response = await fetch(url, {
          method: options.method,
          body: options.body,
          credentials: options.credentials,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
            ...(options.headers
              ? Object.fromEntries(Object.entries(options.headers).filter(([, value]) => value !== undefined))
              : {}),
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key');
          }
          if (response.status === 404) {
            throw new Error('Resource not found');
          }
          if (response.status === 429) {
            throw new Error('Too many requests');
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
    this.tv = new Tv(this.apiClient);
  }

  getVersion(): string {
    return this.version;
  }

  getLanguage(): string {
    return this.language;
  }
}

export { Client };
export type { Person, MovieCredits, TvShow, TvCredits };
