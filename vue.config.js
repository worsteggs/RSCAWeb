const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: "text-loader",
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/style/variables.scss";`,
      },
    },
  },
  devServer: {
    host: "0.0.0.0", // 允许外部ip访问
    port: 8033, // 端口
    proxy: {
      "/api": {
        // target: "http://heart.ifr.fidt.top:61010",
        // target: "http://brain.ifr.fidt.top:61010/",
        target: "http://112.49.22.103:62222", //外网
        // target: "http://192.168.60.117:8088", //仁柯
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    devServer: {
      client: {
        overlay: false // 编译错误时，取消全屏覆盖（建议关掉）
      },
  },
  publicPath: '/RSCAWeb',//github仓库名
  assetsDir: 'RSCAWeb',//同上，否则访问不到静态资源
  outputDir:"dist",
};
