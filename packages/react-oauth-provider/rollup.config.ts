// @ts-ignore
import babel from "rollup-plugin-babel";
// @ts-ignore
import camelCase from "lodash.camelcase";
// @ts-ignore
import commonjs from "rollup-plugin-commonjs";
// @ts-ignore
import resolve from "rollup-plugin-node-resolve";
// @ts-ignore
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
        react: "React",
        events: "EventEmitter",
        qs: "qs"
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
