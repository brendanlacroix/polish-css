var _                  = require('lodash'),
    disableKeyword     = 'polish-disable',
    disableLineKeyword = 'polish-disable-line',
    enableKeyword      = 'polish-enable';

function addIgnores(node, plugins) {
  if (plugins === true) {
    node._polishIgnore = true;
  } else if (_.isArray(plugins)) {
    if (node._polishIgnore && node._polishIgnore.length) {
      node._polishIgnore = _.uniq(node._polishIgnore.concat(plugins));
    } else {
      node._polishIgnore = plugins;
    }
  } else {
    node._polishIgnore = false;
  }
}

function configurePlugins(keyword, string) {
  var plugins = [];

  /*
   * Return true if the only thing in the comment is the keyword,
   * so we know to disable every rule.
   */
  if (keyword === string) {
    return true;
  }

  string = string.replace(keyword, '');
  plugins = _.compact(string.split(','));
  plugins = _.map(plugins, function(plugin) { return plugin.trim(); });

  return plugins;
}

module.exports = function getInlineConfigs(comment, index, level, parent, ast) {
  var commentIndex  = _.indexOf(level.content, comment),
      commentText   = comment.content.trim(),
      plugins       = [],
      currentNode;

  /*
   * All inline configurations must start with `polish-disable` or `polish-disable-line`.
   * `polish-enable` comments are handled when we traverse the AST and act as a breakpoint
   * instead of going through this whole parsing process.
   */
  if (commentText.indexOf(disableKeyword) === -1 && commentText.indexOf(disableLineKeyword) === -1) {
    return;
  }

  if (commentText.indexOf(disableLineKeyword) === 0) {
    plugins = configurePlugins(disableLineKeyword, commentText);

    ast.traverse(function(node) {
      if (node.start.line === comment.start.line && node.end.line === comment.start.line) {
        addIgnores(node, plugins);
      }
    });
  } else if (commentText.indexOf(disableKeyword) === 0) {
    plugins = configurePlugins(disableKeyword, commentText);

    commentIndex++;

    while (level.content[commentIndex]) {
      var reEnabledPlugins = [],
          nodeText;

      currentNode = level.content[commentIndex];

      nodeText = currentNode.content && currentNode.content.toString && currentNode.content.toString().trim();

      if (_.includes(['multilineComment', 'singlelineComment'], currentNode.type) && nodeText.indexOf(enableKeyword) === 0) {
        if (nodeText !== enableKeyword) {
          reEnabledPlugins = configurePlugins(enableKeyword, nodeText);
          plugins = _.difference(plugins, reEnabledPlugins);
        } else {
          break;
        }
      }

      currentNode.traverse(function(node) {
        addIgnores(node, plugins);
      });

      commentIndex++;
    }
  }
};
