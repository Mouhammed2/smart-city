module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'mapbox-gl': 'maplibre-gl'
      };
      return webpackConfig;
    }
  }
};
