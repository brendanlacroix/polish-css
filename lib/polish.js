/*
 * PolishCSS
 */

var getPlugins        = require('./polish-get-plugins'),
    processStylesheet = require('./polish-process-stylesheet'),
    testFile          = require('./polish-test-file'),
    reporter          = require('./polish-error-reporter');

module.exports = function(stylesheet, filePath, options){
  var plugins,
      ast,
      testResults;

  if (!options.config || !Object.keys(options.config).length) {
    throw new Error('Polish requires a list of plugins. Please add some plugin modules to your config.');
  }

  if (stylesheet.length === 0) {
    throw new Error('Polish cannot lint empty files: ' + filePath);
  }

  plugins = getPlugins(options.config, options.ignoredPlugins);

  if (!Object.keys(plugins).length) {
    return {
      filePath: filePath,
      errors: []
    };
  }

  ast = processStylesheet(stylesheet, filePath);

  return {
    filePath : filePath,
    errors   : testFile(ast, filePath, plugins)
  };
};

module.exports.reporter = reporter;
module.exports.getPlugins = getPlugins;
