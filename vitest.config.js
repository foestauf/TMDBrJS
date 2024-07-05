// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    files: 'src/**/*.spec.ts',
    exclude: ['**/node_modules/**', 'lib/**', 'dist/**', 'coverage/**'],
    coverage: {
      exclude: ['**/node_modules/**', 'lib/**', 'dist/**', 'coverage/**', 'commitlint.config.js'],
    },
  },
});
