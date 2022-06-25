const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "mini-micro-app",
      path.join(__dirname, "../../src/index.ts")
    );
  },
});
