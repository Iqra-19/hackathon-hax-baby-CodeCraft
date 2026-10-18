import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        matchMedia: 'readonly',
        IntersectionObserver: 'readonly',
        AudioContext: 'readonly',
        GainNode: 'readonly',
        FormData: 'readonly',
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLVideoElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        Element: 'readonly',
        PointerEvent: 'readonly',
        localStorage: 'readonly',
        innerWidth: 'readonly',
        innerHeight: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
