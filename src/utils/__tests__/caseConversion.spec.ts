import { describe, it, expect } from 'vitest';
import { camelToSnakeCase, camelToSnakeCaseArray } from '../caseConversion.js';

describe('caseConversion', () => {
  describe('camelToSnakeCase', () => {
    it('converts camelCase to snake_case', () => {
      expect(camelToSnakeCase('movieCredits')).toBe('movie_credits');
      expect(camelToSnakeCase('tvCredits')).toBe('tv_credits');
      expect(camelToSnakeCase('combinedCredits')).toBe('combined_credits');
      expect(camelToSnakeCase('images')).toBe('images');
      expect(camelToSnakeCase('latest')).toBe('latest');
    });

    it('handles edge cases', () => {
      expect(camelToSnakeCase('')).toBe('');
      expect(camelToSnakeCase('alreadySnake_case')).toBe('already_snake_case');
    });

    it('handles consecutive uppercase letters correctly', () => {
      expect(camelToSnakeCase('XMLHttpRequest')).toBe('xml_http_request');
      expect(camelToSnakeCase('HTMLParser')).toBe('html_parser');
      expect(camelToSnakeCase('APIKey')).toBe('api_key');
      expect(camelToSnakeCase('getHTML5Parser')).toBe('get_html5_parser');
    });

    it('handles strings starting with uppercase', () => {
      expect(camelToSnakeCase('CamelCase')).toBe('camel_case');
      expect(camelToSnakeCase('MovieCredits')).toBe('movie_credits');
    });

    it('handles numbers in strings', () => {
      expect(camelToSnakeCase('version2Update')).toBe('version2_update');
      expect(camelToSnakeCase('html5Parser')).toBe('html5_parser');
    });

    it('handles single character cases', () => {
      expect(camelToSnakeCase('A')).toBe('a');
      expect(camelToSnakeCase('AB')).toBe('ab');
      expect(camelToSnakeCase('aB')).toBe('a_b');
    });
  });

  describe('camelToSnakeCaseArray', () => {
    it('converts an array of camelCase strings to snake_case', () => {
      const input = ['movieCredits', 'tvCredits', 'combinedCredits', 'images', 'latest'];
      const expected = ['movie_credits', 'tv_credits', 'combined_credits', 'images', 'latest'];
      expect(camelToSnakeCaseArray(input)).toEqual(expected);
    });

    it('handles empty arrays', () => {
      expect(camelToSnakeCaseArray([])).toEqual([]);
    });
  });
});
