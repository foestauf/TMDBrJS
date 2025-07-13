import { IApiClient } from '..';
import ApiURL from './apiURL';
import { camelToSnakeCaseArray } from './caseConversion';

export interface BaseOptions<T extends readonly string[]> {
  include?: T;
}

export type BaseAppendResponse<T extends readonly string[], TMap> = {
  [K in T[number]]: K extends keyof TMap ? TMap[K] : never;
};

export abstract class BaseService<TAppendOptions extends string, TAppendResponseMap> {
  protected apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  protected async getByIdWithAppendToResponse<T extends readonly TAppendOptions[], TResult = Record<string, unknown>>(
    endpoint: string,
    id: string | number,
    options?: BaseOptions<T>,
  ): Promise<TResult & BaseAppendResponse<T, TAppendResponseMap>> {
    const { include } = options ?? {};

    let appendToResponse: string | undefined;
    if (include && include.length > 0) {
      // Convert camelCase options to snake_case for the API
      appendToResponse = camelToSnakeCaseArray([...include]).join(',');
    }

    const url = new ApiURL(endpoint.replace('{id}', id.toString()));
    if (appendToResponse) {
      url.appendParam('append_to_response', appendToResponse);
    }

    try {
      return await this.apiClient.get<TResult & BaseAppendResponse<T, TAppendResponseMap>>(url.toString());
    } catch (error) {
      if (error instanceof Error) {
        // Enhanced error handling for append_to_response specific errors
        if (error.message.includes('append_to_response')) {
          throw new Error(`Failed to fetch ${endpoint} with append_to_response options: ${error.message}`);
        }
        throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
      }
      throw new Error(`Failed to fetch ${endpoint}: Something went wrong`);
    }
  }
}
