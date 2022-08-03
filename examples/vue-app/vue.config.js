const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    // },
  // },
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "mini-micro-app",
      path.join(__dirname, "../../src/index.ts")
    );
  },
});
