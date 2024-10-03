module.exports = {
  stories: [
    "./*.stories.mdx",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-react-native-web"
  ],
  framework: "@storybook/react",
  staticDirs: [
    '../../../node_modules/@expo-google-fonts/open-sans',
    '../../../node_modules/@expo-google-fonts/poppins', 
  ]
}