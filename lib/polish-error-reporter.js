var _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var astHelpers = require('./polish-ast-helpers');

var MAX_SELECTOR_LENGTH = 30;

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
    var selector = astHelpers.getConcatSelector(error.data.rule),
        message;

    if (_.isFunction(error.rule.message)) {
      message = error.rule.message(error);
    } else {
      message = error.rule.message;
    }

    if (selector.length > MAX_SELECTOR_LENGTH) {
      selector = selector.slice(0, MAX_SELECTOR_LENGTH);
      selector += '...';
    }

    output += table([
      [
        chalk.gray('line ' + error.data.rule.start.line),
        chalk.gray('col ' + error.data.rule.start.column),
        selector,
        chalk.red(message)
      ]
    ]);

    output += '\n';
  });

  output += chalk.yellow(logSymbols.warning + ' ' + errors.length + ' warnings\n');

  console.log(output);
};
