import { defineConfig, Format } from "tsup";

export function makeTSUpConfig({
  entry = ["src/*"],
  external = [] as string[],
  noExternal = [],
  format = ["esm", "cjs"] as Format[],
  skipNodeModulesBundle = true,
  clean = true,
  shims = false,
  minify = false,
  splitting = true,
  keepNames = true,
  dts = true,
  sourcemap = true,
} = {}) {
  return defineConfig({
    entry,
    external,
    noExternal,
    platform: "node",
    format,
    skipNodeModulesBundle,
    target: "esnext",
    clean,
    shims,
    minify,
    splitting,
    keepNames,
    dts,
    esbuildOptions: (options) => {
      options.allowOverwrite = true;
    },
    sourcemap,
    esbuildPlugins: [],
    terserOptions: {
      keep_classnames: true,
      keep_fnames: true,
      compress: true,
      sourceMap: true,
      format: {
        comments: true,
        keep_quoted_props: true,
        quote_style: 2,
      },
    },
  });
}
