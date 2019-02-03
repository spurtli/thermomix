module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",

  setupFiles: ["<rootDir>config/jest.js"],

  moduleFileExtensions: [
    "js",
    "ts",
    "tsx"
  ],

  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ]
};
