import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';

export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        fetch: true,
        console: true,
        global: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jest': jestPlugin,
    },
    rules: {
      ...tseslint.configs['strict-type-checked'].rules,
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    ignores: ['dist/*', '*.config.js', '**/coverage/**', 'lib/*', 'tests/*'],
  },
];
