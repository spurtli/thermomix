import babel from "rollup-plugin-babel";
import camelCase from "lodash.camelcase";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";

const pkg = require("./package.json");
const dependencies = Object.keys(pkg.dependencies);

const libraryName = "react-oauth-provider";

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
      globals: {
        'react': 'React'
      }
    },
    { file: pkg.module, format: "es", sourcemap: true }
  ],
  external: dependencies,
  watch: {
    include: "src/**"
  },
  plugins: [
    babel({
      extensions: [".ts", ".tsx"],
      exclude: "node_modules/**"
    }),
    commonjs(),
    resolve({
      extensions: [".ts", ".tsx"],
      browser: true
    }),
    sourceMaps()
  ]
};
