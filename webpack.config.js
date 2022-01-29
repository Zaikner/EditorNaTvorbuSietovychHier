const path = require('path');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports= {
  entry: "./editor/js/canvas.js",
output: {
  filename: "webpackVysledok.js",
  path: path.resolve(__dirname,'editor','js')
},
}