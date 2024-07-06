export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
    ],
  },
};
