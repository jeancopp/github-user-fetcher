const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');


module.exports = [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      'max-len': ['error', { code: 80 }],
      'indent': ['error', 2],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-console': 'off',
    },
  },
];