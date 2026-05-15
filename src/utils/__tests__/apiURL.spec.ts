import { describe, it, expect } from 'vitest';
import ApiURL from '../apiURL';

describe('ApiURL', () => {
  it('toString returns a relative path so Client can apply its configured baseUrl', () => {
    const url = new ApiURL('movie/popular');
    expect(url.toString()).toBe('movie/popular');
  });

  it('preserves query params in toString', () => {
    const url = new ApiURL('movie/popular');
    url.appendParam('page', '2');
    expect(url.toString()).toBe('movie/popular?page=2');
  });

  it('appends multiple params', () => {
    const url = new ApiURL('discover/movie');
    url.appendParam('sort_by', 'popularity.desc');
    url.appendParam('page', '3');
    expect(url.toString()).toBe('discover/movie?sort_by=popularity.desc&page=3');
  });

  it('getURL returns a URL instance whose searchParams reflects appended params', () => {
    const url = new ApiURL('movie/popular');
    url.appendParam('page', '2');
    expect(url.getURL().searchParams.get('page')).toBe('2');
  });
});
