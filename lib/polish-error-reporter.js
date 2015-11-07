var _          = require('lodash'),
    chalk      = require('chalk'),
    table      = require('text-table'),
    logSymbols = require('log-symbols');

var MAX_NODE_STRING_LENGTH = 30;

function printIssues(issues, isFileLevel, severity) {
  var output = '',
      color,
      symbol;

  if (severity === 2) {
    color = chalk.red;
    symbol = logSymbols.error;
  } else {
    color = chalk.yellow;
    symbol = logSymbols.warning;
  }

  _.each(issues, function(issue) {
    var issueTable = [],
        location   = '',
        excerpt    = '',
        message    = '';

    if (isFileLevel) {
      location = 'File warning';
    } else {
      location = issue.error.node.start.line + ':' + issue.error.node.start.column;
      excerpt = issue.error.node.toString();
      excerpt = excerpt.replace(/(\r\n|\n|\r)/gm,"");
      excerpt = excerpt.replace(/\s\s+/g, ' ');

      if (excerpt.length > MAX_NODE_STRING_LENGTH) {
        excerpt = excerpt.slice(0, MAX_NODE_STRING_LENGTH);
        excerpt += '...';
      }
    }

    if (_.isFunction(issue.plugin.message)) {
      message = issue.plugin.message(issue);
    } else {
      message = issue.plugin.message;
    }

    issueTable.push(color(symbol));
    issueTable.push(chalk.gray(location));

    if (excerpt) {
      issueTable.push(excerpt);
    }

    issueTable.push(color(message));

    output += table([issueTable]);
    output += '\n';
  });

  return output;
}

module.exports = function polishReporter (path, errors, warnings){
  var output       = '',
      fileErrors   = [],
      nodeErrors   = [],
      fileWarnings = [],
      nodeWarnings = [],
      errorTotal,
      warningTotal;

  if (!errors.length && !warnings.length){
    return;
  }

  if (path) {
    output += chalk.underline(path + '\n');
  }

  _.each(errors, function (error) {
    if (error.error.node) {
      nodeErrors.push(error);
    } else {
      fileErrors.push(error);
    }
  });

  _.each(warnings, function (warning) {
    if (warning.error.node) {
      nodeWarnings.push(warning);
    } else {
      fileWarnings.push(warning);
    }
  });

  output += printIssues(fileErrors, true, 2);
  output += printIssues(fileWarnings, true, 1);
  output += printIssues(nodeErrors, false, 2);
  output += printIssues(nodeWarnings, false, 1);

  errorTotal = fileErrors.length + nodeErrors.length;
  warningTotal = fileWarnings.length + nodeWarnings.length;

  output += chalk.red(logSymbols.error + ' ' + errorTotal + ' errors     ');
  output += chalk.yellow(logSymbols.warning + ' ' + warningTotal + ' warnings\n');

  console.log(output);
};
