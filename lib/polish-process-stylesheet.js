var _           = require('lodash');
var path        = require('path');
var gonzales    = require('gonzales-pe');

function parseCommentRules (comment) {
  comment = comment.content.replace('polish', '').trim().replace(/=/g,':').split(' ');
  comment = comment.map(function(comm){
    var config = comm.split(':');
    config[1] = config[1] === 'false' ? false : true;
    return config;
  });
  comment = _.object(comment);
  return comment;
}

function readComment (comment, level) {
  if (comment.content.trim().indexOf('polish') !== 0) {
    return;
  }

  var commentIndex = _.indexOf(level.content, comment),
      adjacentRule;

  commentIndex++;

  /* Continue while an adjacent rule hasn't been found and there are unchecked nodes */
  while (!adjacentRule && level.content[commentIndex]) {
    if ( level.content[commentIndex].is('ruleset') ){
      adjacentRule = level.content[commentIndex];
    }

    commentIndex++;
  }

  if ( adjacentRule ){
    adjacentRule.ruleConfig = parseCommentRules(comment);
  }
}

module.exports = function processStylesheet(stylesheet, filepath) {
  var filetype = path.extname(filepath).replace('.','').toLowerCase(),
      output;

  if (!_.contains(['css','scss','sass','less'], filetype)){
    throw new Error('Polish only accepts css, scss, sass, and less files.');
  }

  output = {
    name: path.basename(filepath).split('.')[0],
    ast:  gonzales.parse(stylesheet, { syntax: filetype })
  };

  output.ast.traverseByTypes(['multilineComment', 'singlelineComment'], function (comment, index, level, parent){
    readComment(comment, level);
  });

  return output;
};