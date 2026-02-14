import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const reactHooksRules =
  reactHooks.configs?.['recommended-latest']?.rules ??
  reactHooks.configs?.recommended?.rules ??
  {};

const reactRefreshRules =
  reactRefresh.configs?.vite?.rules ??
  reactRefresh.configs?.recommended?.rules ??
  {};

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'qwen-code/**',
      '.factory/**',
      'public/**',
      // This repo contains some non-app scripts; keep lint focused on the product.
      'test-setup.js',
    ],
  },
  // Frontend (React)
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooksRules,
      ...reactRefreshRules,
      // Context/util modules are common in React apps; this rule is too strict for this repo.
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Backend + tooling (Node)
  {
    files: [
      'server.js',
      'server/**/*.js',
      '*.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // `while (true)` read loops are intentional in streaming handlers.
      'no-constant-condition': 'off',
    },
  },
];
