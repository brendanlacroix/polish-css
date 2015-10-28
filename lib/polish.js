/*
 * PolishCSS
 */

var getPlugins        = require('./polish-get-plugins'),
    processStylesheet = require('./polish-process-stylesheet'),
    testFile          = require('./polish-test-file'),
    reporter          = require('./polish-error-reporter');

module.exports = function(stylesheet, filepath, options){
  var plugins,
      processedStyles,
      testResults;

  if (!options.plugins && !options.pluginsDirectory) {
    throw new Error('Polish requires a list of plugins. Please specify a list of modules or the path to a directory containing a set of plugins.');
  }

  if (stylesheet.length === 0) {
    throw new Error('Polish cannot lint empty files: ' + filepath);
  }

  plugins = getPlugins(options.plugins, options.pluginsDirectory, options.ignoredPlugins);

  processedStyles = processStylesheet(stylesheet, filepath);

  return testFile(processedStyles, filepath, plugins);
};

module.exports.reporter = reporter;
module.exports.getPlugins = getPlugins;