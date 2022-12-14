module.exports = {
  env: {
    node: true,
    browser: true,
    webextensions: true,
    es2021: true
  },
  extends: ['standard', 'prettier', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: ['src/**/*.test.ts', 'lib/'],
  plugins: ['@typescript-eslint', 'lodash', 'jest'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // tree shake lodash
    'lodash/import-scope': [2, 'method'],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ]
  },
  globals: {
    chrome: true,
    ExtensionWindow: true
  }
};
