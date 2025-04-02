import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    globals: true,
    environment: 'node',
    setupFiles: ['tests/e2e/setup.ts'],
    testTimeout: 10000, // 10 seconds timeout for API calls
  },
});
