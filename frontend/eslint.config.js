import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Add formatting rules below
      'indent': ['error', 2], // Enforce 2 spaces for indentation
      'quotes': ['error', 'single'], // Enforce single quotes
      'semi': ['error', 'always'], // Enforce semicolons
      'comma-dangle': ['error', 'always-multiline'], // Trailing commas
      'object-curly-spacing': ['error', 'always'], // Spaces inside curly braces
      'array-bracket-spacing': ['error', 'never'], // No space inside array brackets
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // Space after colon in objects
      'no-trailing-spaces': ['error'], // No trailing whitespace
      'space-before-function-paren': ['error', 'never'], // No space before function parenthesis
      'arrow-spacing': ['error', { 'before': true, 'after': true }], // Enforce space around arrow functions
    },
  },
)
