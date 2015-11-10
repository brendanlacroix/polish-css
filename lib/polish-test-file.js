var _    = require('lodash');

module.exports = function(ast, filePath, plugins) {
  var errors   = [],
      warnings = [];

  _.each(plugins, function(plugin){
    var results,
        array;

    if (plugin.severity === 2) {
      array = errors;
    } else if (plugin.severity === 1) {
      array = warnings;
    } else {
      return;
    }

    results = plugin.test(ast, filePath, plugin.options);

    if (!results || !results.length || !_.isArray(results)){
      return;
    }

    // Remove failures that are on plugins with inline configs
    _.each(results, function (result){
      if (!result.node || !result.node.ruleConfig) {
        return;
      }

      if (result.node.ruleConfig[plugin.name] === false) {
        results = _.without(results, result);
      }
    });

    _.each(results, function(result){
      array.push({
        plugin: _.pick(plugin, ['name', 'message', 'severity']),
        error: result
      });
    });
  });

  return {
    errors   : errors,
    warnings : warnings
  };
};