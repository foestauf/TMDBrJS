import typeScriptParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
    files: ['**/*.ts'],
  },
  {
    ignores: ['dist/*', '*.config.js', '**/coverage/**', 'lib/*'],
  },
];
