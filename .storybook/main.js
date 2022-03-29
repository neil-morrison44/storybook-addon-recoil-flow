module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "../dist/preset.js",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
}
