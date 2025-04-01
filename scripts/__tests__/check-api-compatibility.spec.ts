import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { checkApiCompatibility, fetchApiVersion } from '../check-api-compatibility.js';

// Mock dependencies
vi.mock('node-fetch', () => ({
  default: vi.fn()
}));

vi.mock('fs', () => ({
  readFileSync: vi.fn()
}));

vi.mock('dotenv', () => ({
  config: vi.fn()
}));

describe('API Compatibility Check', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock environment variables
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  describe('fetchApiVersion', () => {
    it('should return version from API response', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ version: '3.0.0' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const version = await fetchApiVersion();
      expect(version).toBe('3.0.0');
    });

    it('should return "3" when version is not in response', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({})
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const version = await fetchApiVersion();
      expect(version).toBe('3');
    });

    it('should return "unknown" when API request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({ status_message: 'Invalid API key' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const version = await fetchApiVersion();
      expect(version).toBe('unknown');
    });

    it('should return "unknown" when API key is not set', async () => {
      delete process.env.TMDB_API_KEY;
      const version = await fetchApiVersion();
      expect(version).toBe('unknown');
    });

    it('should return "unknown" when fetch throws an error', async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));
      const version = await fetchApiVersion();
      expect(version).toBe('unknown');
    });
  });

  describe('checkApiCompatibility', () => {
    it('should pass when versions match', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ version: '3.0.0' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
      (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify({ tmdbApiVersion: '3.0.0' }));

      await expect(checkApiCompatibility()).resolves.not.toThrow();
    });

    it('should warn when versions mismatch', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ version: '4.0.0' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
      (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify({ tmdbApiVersion: '3.0.0' }));

      const consoleSpy = vi.spyOn(console, 'warn');
      await checkApiCompatibility();
      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Warning: API version mismatch!');
    });

    it('should exit with error when version is unknown', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({ status_message: 'Invalid API key' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
      (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify({ tmdbApiVersion: '3.0.0' }));

      const processSpy = vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`Process exited with code ${code}`);
      });
      await expect(checkApiCompatibility()).rejects.toThrow('Process exited with code 1');
    });

    it('should detect and report breaking changes', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ version: '4.0.0' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
      (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify({ tmdbApiVersion: '4.0.0' }));

      const consoleSpy = vi.spyOn(console, 'warn');
      await checkApiCompatibility();
      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Breaking changes detected:');
      expect(consoleSpy).toHaveBeenCalledWith('- API v4 requires authentication changes');
      expect(consoleSpy).toHaveBeenCalledWith('- Some endpoints have been deprecated');
    });

    it('should handle package.json read errors', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ version: '3.0.0' })
      };
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
      (readFileSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('File not found');
      });

      const processSpy = vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`Process exited with code ${code}`);
      });
      await expect(checkApiCompatibility()).rejects.toThrow('Process exited with code 1');
    });
  });
}); 