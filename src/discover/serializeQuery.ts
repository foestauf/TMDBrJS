import ApiURL from '../utils/apiURL';
import { camelToSnakeCase } from '../utils/caseConversion';

export function serializeDiscoverQuery(url: ApiURL, query?: Record<string, unknown>): void {
  if (!query) return;
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    const snakeKey = camelToSnakeCase(key);
    if (Array.isArray(value)) {
      url.appendParam(snakeKey, value.map((v) => String(v)).join(','));
      continue;
    }
    if (typeof value === 'boolean') {
      url.appendParam(snakeKey, value ? 'true' : 'false');
      continue;
    }
    url.appendParam(snakeKey, String(value));
  }
}
