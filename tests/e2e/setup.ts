import dotenv from 'dotenv';
import { beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

// Load test environment variables from .env.test if it exists
if (existsSync(join(process.cwd(), '.env.test'))) {
  dotenv.config({ path: '.env.test' });
}

beforeAll(() => {
  // Verify required environment variables
  if (!process.env.TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is required for e2e tests. Set it in .env.test or as an environment variable.');
  }
});

afterAll(() => {
  // Clean up any resources if needed
});
