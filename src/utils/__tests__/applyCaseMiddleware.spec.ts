import { camelCase } from 'camel-case';
import { snakeCase } from 'snake-case';
import { applyCaseMiddleware } from '../applyCaseMiddleware';
import { describe, it, expect } from 'vitest';

describe('applyCaseMiddleware', () => {
  it('converts object keys to camel case', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
    };
    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };
    expect(applyCaseMiddleware(input, camelCase)).toEqual(expected);
  });

  it('converts nested object keys to camel case', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      address: {
        street_name: 'Main St',
        city: 'Townsville',
      },
    };
    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      address: {
        streetName: 'Main St',
        city: 'Townsville',
      },
    };
    expect(applyCaseMiddleware(input, camelCase)).toEqual(expected);
  });

  it('converts array items to camel case', () => {
    const input = [
      {
        first_name: 'John',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
    ];
    const expected = [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ];
    expect(applyCaseMiddleware(input, camelCase)).toEqual(expected);
  });

  it('converts object keys to snake case', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };
    const expected = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
    };
    expect(applyCaseMiddleware(input, snakeCase)).toEqual(expected);
  });
});
