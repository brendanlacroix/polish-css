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
      fileErrors = [];

  _.each(results.errors, function (error){
    if (error.error.node) {
      lineErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(fileErrors, function (error){
    var message;

    if (_.isFunction(error.plugin.message)) {
      message = error.plugin.message(error);
    } else {
      message = error.plugin.message;
    }

    output += table([
      [
        chalk.gray('File warning: '),
        chalk.red(message)
      ]
    ]);

    output += '\n';
  });

  _.each(lineErrors, function (error){
    var node = error.error.node.toString(),
        message;

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
        chalk.gray(error.error.node.start.line + ':' + error.error.node.start.column),
        node,
        chalk.red(message)
      ]
    ]);

    output += '\n';
  });

  output += chalk.yellow(logSymbols.warning + ' ' + results.errors.length + ' warnings\n');

  console.log(output);
};
