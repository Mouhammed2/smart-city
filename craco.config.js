const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "mapbox-gl": "maplibre-gl",
        "@": path.resolve(__dirname, "src/fixMyCity"),
      };
      return webpackConfig;
    },
  },
  devServer: {
    proxy: {
      "/auth": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
      "/api/eventhandler": {
        target: "http://localhost:5138",
        changeOrigin: true,
        secure: false,
      },
      "/api/city": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
