import { vi, describe, it, beforeEach, expect } from 'vitest';
import { BaseService, BaseOptions } from '../BaseService';
import { IApiClient } from '../..';

// Test implementation of BaseService
type TestAppendOptions = 'credits' | 'videos' | 'images';

type TestAppendResponseMap = {
  credits: { cast: Array<Record<string, unknown>> };
  videos: { results: Array<Record<string, unknown>> };
  images: { backdrops: Array<Record<string, unknown>> };
};

class TestService extends BaseService<TestAppendOptions, TestAppendResponseMap> {
  async testGetById<T extends readonly TestAppendOptions[]>(id: string | number, options?: BaseOptions<T>) {
    return this.getByIdWithAppendToResponse<T>('test/{id}', id, options);
  }
}

describe('BaseService', () => {
  let mockApiClient: IApiClient;
  let testService: TestService;

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
    } as unknown as IApiClient;
    testService = new TestService(mockApiClient);
  });

  describe('getByIdWithAppendToResponse', () => {
    it('should call API without append_to_response when no options provided', async () => {
      const mockResponse = { id: 1, title: 'Test' };
      vi.spyOn(mockApiClient, 'get').mockResolvedValue(mockResponse);

      const result = await testService.testGetById('123');

      expect(mockApiClient.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/test/123');
      expect(result).toEqual(mockResponse);
    });

    it('should call API with append_to_response when options provided', async () => {
      const mockResponse = { id: 1, title: 'Test', credits: { cast: [] } };
      vi.spyOn(mockApiClient, 'get').mockResolvedValue(mockResponse);

      const result = await testService.testGetById('123', { include: ['credits'] as const });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/test/123?append_to_response=credits',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle multiple append options', async () => {
      const mockResponse = {
        id: 1,
        title: 'Test',
        credits: { cast: [] },
        videos: { results: [] },
      };
      vi.spyOn(mockApiClient, 'get').mockResolvedValue(mockResponse);

      const result = await testService.testGetById('123', {
        include: ['credits', 'videos'] as const,
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/test/123?append_to_response=credits%2Cvideos',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw enhanced error for append_to_response failures', async () => {
      const error = new Error('append_to_response validation failed');
      vi.spyOn(mockApiClient, 'get').mockRejectedValue(error);

      await expect(testService.testGetById('123', { include: ['credits'] })).rejects.toThrow(
        'Failed to fetch test/{id} with append_to_response options: append_to_response validation failed',
      );
    });

    it('should throw general error for other failures', async () => {
      const error = new Error('Network error');
      vi.spyOn(mockApiClient, 'get').mockRejectedValue(error);

      await expect(testService.testGetById('123')).rejects.toThrow('Failed to fetch test/{id}: Network error');
    });

    it('should handle non-Error objects', async () => {
      vi.spyOn(mockApiClient, 'get').mockRejectedValue('String error');

      await expect(testService.testGetById('123')).rejects.toThrow('Failed to fetch test/{id}: Something went wrong');
    });
  });
});
