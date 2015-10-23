var _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var MAX_NODE_STRING_LENGTH = 30;

module.exports = function printErrors (filePath, errors){
  if (!errors || !errors.length){
    return;
  }

  var output = chalk.underline(filePath) + '\n',
      lineErrors = [],
      fileErrors = [];

  _.each(errors, function (error){
    if (error.data.rule) {
      lineErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(fileErrors, function (error){
    var message;

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
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
    var node = error.data.rule.toString(),
        message;

    node = node.replace(/(\r\n|\n|\r)/gm,"");
    node = node.replace(/\s\s+/g, ' ');

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
    }

    if (node.length > MAX_NODE_STRING_LENGTH) {
      node = node.slice(0, MAX_NODE_STRING_LENGTH);
      node += '...';
    }

    output += table([
      [
        chalk.gray('line ' + error.data.rule.start.line),
        chalk.gray('col ' + error.data.rule.start.column),
        node,
        chalk.red(message)
      ]
    ]);

    output += '\n';
  });

  output += chalk.yellow(logSymbols.warning + ' ' + errors.length + ' warnings\n');

  console.log(output);
};
