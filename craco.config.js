const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'mapbox-gl': 'maplibre-gl',
        '@': path.resolve(__dirname, 'src/civic')
      };
      return webpackConfig;
    }
  }
};
