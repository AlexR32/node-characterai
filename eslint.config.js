
const globals = require('globals');
const pluginJs = require('@eslint/js');
const stylisticJs = require('@stylistic/eslint-plugin-js');

module.exports = [
  pluginJs.configs.all,
  stylisticJs.configs['all-flat'],

  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/js/array-element-newline': ['error', 'consistent'],
      '@stylistic/js/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@stylistic/js/comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      }],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/function-paren-newline': ['error', 'consistent'],
      '@stylistic/js/indent': ['error', 2, {
        'SwitchCase': 1,
      }],
      '@stylistic/js/lines-around-comment': 'off',
      '@stylistic/js/multiline-comment-style': 'off',
      '@stylistic/js/multiline-ternary': ['error', 'never'],
      '@stylistic/js/newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 3 }],
      '@stylistic/js/no-extra-parens': 'off',
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
      '@stylistic/js/padded-blocks': ['error', 'never'],
      '@stylistic/js/quote-props': ['error', 'consistent'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/space-before-function-paren': ['error', {
        'anonymous': 'never',
        'named': 'never',
        'asyncArrow': 'always',
      }],
      '@stylistic/js/spaced-comment': 'off',
      // '@stylistic/js/': ['error', ''],
    },
  },

  {
    // name: 'alex/main',
    files: ['**/*.js'],
    ignores: ['**/node_modules/', '.git/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'warn',
    },
    rules: {
      'camelcase': 'off', // warn
      'capitalized-comments': 'off',
      'consistent-return': 'off',
      'curly': ['error', 'multi-line'],
      'func-names': 'off', // warn
      'func-style': 'off', // warn
      'id-length': 'off',
      'line-comment-position': 'off',
      'max-classes-per-file': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'no-await-in-loop': 'off',
      'no-bitwise': 'off',
      'no-console': 'off',
      'no-continue': 'off',
      'no-eval': 'off',
      'no-extend-native': 'off',
      'no-inline-comments': 'off',
      'no-magic-numbers': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
      'object-shorthand': 'off', // warn
      'one-var': 'off',
      'prefer-destructuring': 'off',
      'require-atomic-updates': 'off',
      'require-await': 'off', // warn
      'require-unicode-regexp': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      'strict': 'off',
    },
  },
];
