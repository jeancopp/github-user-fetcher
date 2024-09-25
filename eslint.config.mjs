import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'max-len': ['error', {code: 80}],
      'indent': ['error', 2],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-console': 'off',
    },
  }
];