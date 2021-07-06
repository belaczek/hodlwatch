/*
 * from https://www.npmjs.com/package/cors-anywhere#example
 */

// Listen on a specific host via the HOST environment constiable
const host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment constiable
const port = process.env.PORT || 8080;

const cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });
