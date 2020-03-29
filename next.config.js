const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const pipe = require("lodash/fp/pipe");

module.exports = pipe(withBundleAnalyzer)({
  webpack(config, options) {
    // Further custom configuration here
    return config;
  },
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "static",
      reportFilename: "../../bundles/server.html",
    },
    browser: {
      analyzerMode: "static",
      reportFilename: "../bundles/client.html",
    },
  },
  distDir: "../.next",
});
