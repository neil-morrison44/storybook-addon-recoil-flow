import * as esbuild from "esbuild"

// const result = await esbuild.build({
//   entryPoints: ["./src/flow/graph.tsx"],
//   outfile: "dist/flow/graph.js",
//   bundle: true,
//   minify: false,
//   platform: "browser",
//   format: "esm",
//   external: [],
// })

// console.info(result)

const result = await esbuild.build({
  entryPoints: ["./src/sixteenEighteenShim/index.tsx"],
  outfile: "dist/sixteenEighteenShim/index.js",
  bundle: true,
  minify: false,
  platform: "browser",
  format: "esm",
  external: ["@storybook/addons"],
})

console.info(result)
