module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { browsers: [">1.00%", "not ie 11", "not op_mini all"] }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: ["@babel/plugin-proposal-class-properties"]
};
