module.exports = {
  "parser": "babel-eslint",
  "plugins": ["react"],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    },
    "sourceType": "module",
  },
  "rules": {
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
  },
};
