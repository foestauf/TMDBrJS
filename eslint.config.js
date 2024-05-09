import typeScriptParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    languageOptions: {
      parser: typeScriptParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
    files: ['**/*.ts'],
    ignores: ['**/coverage/**'],
  },
];
