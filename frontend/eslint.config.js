import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// ─────────────────────────────────────────────────────────────────────────────
// ESLint Flat Config — required from ESLint v9.0.0 onwards
//
// ESLint 9 moved away from .eslintrc files to this new "flat config" format.
// This file tells ESLint:
//   1. Which files to check
//   2. What environment the code runs in (browser)
//   3. Which plugins to use
//   4. Which rules to enforce
// ─────────────────────────────────────────────────────────────────────────────

export default [
  // ── 1. Files to IGNORE completely ─────────────────────────────────────────
  // The dist/ folder is the compiled build output — we never lint generated code.
    { ignores: ['dist', 'node_modules'] },

  // ── 2. Main config block for all JS and JSX files ─────────────────────────
    {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
        ecmaVersion: 2020,

      // globals.browser adds all standard browser variables (window, document,
      // console, fetch, etc.) so ESLint does not flag them as undefined.
        globals: globals.browser,

        parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },  // Enable JSX parsing
        sourceType: 'module',          // We use ES modules (import/export)
        },
    },

    // ── Plugins ──────────────────────────────────────────────────────────────
    // Plugins add extra rules on top of ESLint's core rules.
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
    },

    // ── Rules ─────────────────────────────────────────────────────────────────
    rules: {
      // Spread in all recommended react-hooks rules.
      // The most important ones:
      //   - Hooks must only be called at the top level (not inside loops/conditions)
      //   - Hooks must only be called from React functions
        ...reactHooks.configs.recommended.rules,

      // Warn if a file exports something other than a React component.
      // This is required for Vite's Fast Refresh (hot reload) to work correctly.
        'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
        ],

      // ── Code quality rules ──────────────────────────────────────────────────
      // These catch common mistakes without being too strict.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables
      'no-console': 'warn',              // Warn on console.log left in production code
      'no-undef': 'error',               // Error on variables that are not defined
      'react-hooks/exhaustive-deps': 'warn', // Warn on missing useEffect dependencies
    },
    },
]
