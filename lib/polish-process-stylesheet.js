var _                = require('lodash'),
    path             = require('path'),
    gonzales         = require('gonzales-pe'),
    getInlineConfigs = require('./polish-get-inline-configs');

module.exports = function processStylesheet(stylesheet, filepath) {
  var filetype = path.extname(filepath).replace('.','').toLowerCase(),
      output;

  if (!_.includes(['css', 'scss', 'sass', 'less'], filetype)){
    throw new Error('Polish only accepts css, scss, sass, and less files.');
  }

  output = gonzales.parse(stylesheet, { syntax: filetype });

  output.traverse(function(node) {
    node._polishIgnore = false;
  });

  output.traverseByTypes(['multilineComment', 'singlelineComment'], function (comment, index, level, parent) {
    getInlineConfigs(comment, index, level, parent, output);
  });

  return output;
};