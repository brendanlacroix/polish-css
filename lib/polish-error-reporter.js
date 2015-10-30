var _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var MAX_NODE_STRING_LENGTH = 30;

module.exports = function printErrors (results){

  if (!results.errors || !results.errors.length){
    return;
  }

  var output = chalk.underline(results.filePath) + '\n',
      lineErrors = [],
      fileErrors = [],
      warnings = 0,
      errors = 0;

  _.each(results.errors, function (error){
    if (error.error.node) {
      lineErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(fileErrors, function (error){
    var severity = error.plugin.severity,
        message;

    if (severity === 0) {
      return;
    } else if (severity === 1) {
      warnings++;
    } else if (severity === 2) {
      errors++;
    }

    if (_.isFunction(error.plugin.message)) {
      message = error.plugin.message(error);
    } else {
      message = error.plugin.message;
    }

    output += table([
      [
        severity === 2 ? chalk.red(logSymbols.error) : chalk.yellow(logSymbols.warning),
        chalk.gray('File warning: '),
        severity === 2 ? chalk.red(message) : chalk.yellow(message)
      ]
    ]);

    output += '\n';
  });

  _.each(lineErrors, function (error){
    var node = error.error.node.toString(),
        severity = error.plugin.severity,
        message;

    if (severity === 0) {
      return;
    } else if (severity === 1) {
      warnings++;
    } else if (severity === 2) {
      errors++;
    }

    node = node.replace(/(\r\n|\n|\r)/gm,"");
    node = node.replace(/\s\s+/g, ' ');

    if (_.isFunction(error.plugin.message)) {
      message = error.plugin.message(error);
    } else {
      message = error.plugin.message;
    }

    if (node.length > MAX_NODE_STRING_LENGTH) {
      node = node.slice(0, MAX_NODE_STRING_LENGTH);
      node += '...';
    }

    output += table([
      [
        severity === 2 ? chalk.red(logSymbols.error) : chalk.yellow(logSymbols.warning),
        chalk.gray(error.error.node.start.line + ':' + error.error.node.start.column),
        node,
        severity === 2 ? chalk.red(message) : chalk.yellow(message)
      ]
    ]);

    output += '\n';
  });

  output += chalk.red(logSymbols.error + ' ' + errors + ' errors     ');
  output += chalk.yellow(logSymbols.warning + ' ' + warnings + ' warnings\n');

  console.log(output);
};
