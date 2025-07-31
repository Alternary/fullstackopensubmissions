import js from "@eslint/js";
import globals from "globals";
// import json from "@eslint/json";
// import markdown from "@eslint/markdown";
// import css from "@eslint/css";
import { defineConfig } from "eslint/config";
// import stylisticJs from '@stylistic/eslint-plugin-js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: { 
      '@stylistic': stylistic,
    },
    rules: { 
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  { 
    ignores: ['dist/**'], 
  },
]

// export default defineConfig([
//   // js.configs.recommended,
//   { files: ["**/*.{js,mjs,cjs}"],
//     // plugins: { js },
//     plugins: { '@stylistic': stylistic, },
//     // rules: {
//     //   '@stylistic/indent': ['error', 2],
//     //   '@stylistic/linebreak-style': ['error', 'unix'],
//     //   '@stylistic/quotes': ['error', 'single'],
//     //   '@stylistic/semi': ['error', 'never'],
//     //   eqeqeq: 'error'
//     //   'no-trailing-spaces': 'error',
//     //   'object-curly-spacing': ['error', 'always'],
//     //   'arrow-spacing': ['error', { before: true, after: true }],
//     // },
//     extends: ["js/recommended"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
//   { ignores: ['dist/**'], },
//   //{ files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
//   // { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
//   // { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
//   // { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
//   // { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
//   // { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
// ]);
