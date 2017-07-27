module.exports = {
  presets: [
    "es2015",
    "react",
    "stage-1",
  ],
  env: {
    development: {
      plugins: ["transform-class-properties"]
    },
    production: {
      plugins: ["transform-react-remove-prop-types"],
    }
  },
  plugins: [
    "transform-class-properties"
  ],
};
