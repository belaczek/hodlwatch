const withSass = require('@zeit/next-sass')
const pipe = require('lodash/fp/pipe')

module.exports = pipe(withSass)({
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
  distDir: '../.next'
})
