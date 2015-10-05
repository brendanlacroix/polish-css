/*
 * PolishCSS
 */

var _                 = require('lodash'),
    getPlugins        = require('./polish-get-plugins'),
    processStylesheet = require('./polish-process-stylesheet'),
    testFile          = require('./polish-test-file');

module.exports = function(stylesheet, filepath, options){
  var plugins,
      processedStyles,
      testResults;

  if (!options.plugins && !options.pluginsDirectory) {
    console.error('Polish requires a list of plugins. Please specify a list of modules');
    console.error('or the path to a directory containing a set of plugins.');
    process.exit(1);
  }

  plugins = getPlugins(options.plugins, options.pluginsDirectory);

  // If there are no plugins, there's no need to continue.
  if (!plugins || !Object.keys(plugins).length) {
    console.error('No plugins were found.');
    process.exit(1);
  }

  processedStyles = processStylesheet(stylesheet, filepath);
  
  return testFile(processedStyles, filepath, plugins);
};