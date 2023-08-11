const fs = require('fs');
const path = require('path');
const { rimrafSync } = require('rimraf');
const webpackPaths = require('../configs/webpack.paths');

module.exports = function deleteSourceMaps() {
  if (fs.existsSync(webpackPaths.distMainPath))
    rimrafSync(path.join(webpackPaths.distMainPath, '*.js.map'), {
      glob: true,
    });
  if (fs.existsSync(webpackPaths.distRendererPath))
    rimrafSync(path.join(webpackPaths.distRendererPath, '*.js.map'), {
      glob: true,
    });
};
