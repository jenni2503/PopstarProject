module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    }
  };
  