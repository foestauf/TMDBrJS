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
      expect(camelToSnakeCase('multipleCapitalLettersAPI')).toBe('multiple_capital_letters_a_p_i');
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
