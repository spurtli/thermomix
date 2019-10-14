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
// @ts-ignore
import typescript from "rollup-plugin-typescript2";
// @ts-ignore
import builtins from "rollup-plugin-node-builtins";

const pkg = require("./package.json");
const dependencies = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

const libraryName = "react-oauth-provider";

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
      globals: {
        moment: "moment",
        react: "React",
        events: "EventEmitter",
        qs: "qs"
      }
    },
    {file: pkg.module, format: "es", sourcemap: true}
  ],
  external: dependencies,
  watch: {
    include: "src/**/*"
  },
  plugins: [
    builtins(),
    typescript(),
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
