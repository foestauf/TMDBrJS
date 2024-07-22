import typeScriptParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';

export default [
  {
    languageOptions: {
      parser: typeScriptParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jest: jestPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
    files: ['**/*.ts'],
    ignores: ['.coverage/**'],
  },
];
