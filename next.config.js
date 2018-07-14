const withSass = require('@zeit/next-sass')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const pipe = require('lodash/fp/pipe')

module.exports = pipe(
  withSass,
  withBundleAnalyzer
)({
  sassLoaderOptions: {
    includePaths: [
      'node-modules',
      'src',
      require('path').resolve(__dirname, 'node_modules')
    ]
  },
  webpack (config, options) {
    // Further custom configuration here
    return config
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  distDir: '../.next'
})
