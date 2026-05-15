import { vi, describe, it, beforeAll, expect } from 'vitest';
import { Client } from '../..';

describe('Configuration', () => {
  let tmdb: Client;
  beforeAll(() => {
    tmdb = new Client({ apiKey: '123' });
  });

  it('details() hits configuration', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue({ images: {}, changeKeys: [] });
    await tmdb.configuration.details();
    const calledWith = (tmdb.apiClient.get as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    expect(calledWith).toMatch(/configuration(\?|$)/);
  });

  it('countries() hits configuration/countries', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.countries();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/countries'));
  });

  it('languages() hits configuration/languages', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.languages();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/languages'));
  });

  it('jobs() hits configuration/jobs', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.jobs();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/jobs'));
  });

  it('primaryTranslations() hits configuration/primary_translations', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.primaryTranslations();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/primary_translations'));
  });

  it('timezones() hits configuration/timezones', async () => {
    vi.spyOn(tmdb.apiClient, 'get').mockResolvedValue([]);
    await tmdb.configuration.timezones();
    expect(tmdb.apiClient.get).toHaveBeenCalledWith(expect.stringContaining('configuration/timezones'));
  });
});
