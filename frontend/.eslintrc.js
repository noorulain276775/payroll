module.exports = {
  parserOptions: {
    ecmaVersion: 2020, // modern JS features
    sourceType: 'module', // allows import/export
    ecmaFeatures: {
      jsx: true, // enable JSX parsing
    },
  },
  settings: {
    react: {
      version: 'detect', // auto-detect React version
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended', // keep prettier last
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    // --- React Specific ---
    'react/prop-types': 'warn', // keep prop-types warning for JS
    'react/react-in-jsx-scope': 'off', // not needed for React 17+
    'react/jsx-uses-react': 'off',

    // --- Hooks Rules ---
    'react-hooks/rules-of-hooks': 'error', // enforce rules of hooks
    'react-hooks/exhaustive-deps': 'warn', // check effect dependencies

    // --- Best Practices ---
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // allow _var as unused
    'eqeqeq': ['error', 'always'], // always use ===
    'curly': ['error', 'all'], // always use curly braces

    // --- Code Style ---
    'quotes': ['error', 'single'], // enforce single quotes
    'semi': ['error', 'always'], // always use semicolons
    'comma-dangle': ['error', 'always-multiline'], // trailing commas in multi-line
    'indent': ['error', 2], // 2 spaces indentation
    'no-multiple-empty-lines': ['error', { max: 1 }], // max 1 empty line
    'object-curly-spacing': ['error', 'always'], // space inside { }
    'array-bracket-spacing': ['error', 'never'], // no space inside [ ]
  },
};
