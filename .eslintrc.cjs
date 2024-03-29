module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['dist/**/*', 'src/**/*.test.ts', 'src/**/__mocks__/*'],
  env: {
    browser: true,
    node: true
  },
  overrides: [
    // Ignore explicity `any` types for test files
    {
      files: ['*.test.ts', '*.spec.ts', '*.test.js', '*.spec.js', '__mocks__/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },

    // Ingore unused vars prefixed with an underscore
    {
      files: ['*.ts', '*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
      }
    }
  ]
};
