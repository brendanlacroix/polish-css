/*
 * PolishCSS
 */

var loadPlugins       = require('./polish-load-plugins'),
    processStylesheet = require('./polish-process-stylesheet'),
    testFile          = require('./polish-test-file'),
    reporter          = require('./polish-error-reporter');

module.exports = function(stylesheet, filePath, config){
  var plugins,
      ast,
      testResults;

  if (stylesheet.length === 0) {
    throw new Error('Polish cannot lint empty files: ' + filePath);
  }

  plugins = loadPlugins(config);

  if (!Object.keys(plugins).length) {
    return {
      filePath : filePath,
      errors   : [],
      warnings : []
    };
  }

  ast = processStylesheet(stylesheet, filePath);
  testResults = testFile(ast, filePath, plugins);

  return {
    filePath : filePath,
    errors   : testResults.errors || [],
    warnings : testResults.warnings || []
  };
};

module.exports.reporter = reporter;
