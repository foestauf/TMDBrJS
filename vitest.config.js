// vitest.config.ts
// Configuration updated to properly separate unit tests from E2E tests
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', 'lib/**', 'dist/**', 'coverage/**', 'tests/**'],
    coverage: {
      exclude: ['**/node_modules/**', 'lib/**', 'dist/**', 'coverage/**', '*.config.js', '*.config.ts', 'tests/**'],
    },
  },
});
