import * as esbuild from "esbuild"

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
