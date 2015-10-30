var _    = require('lodash');
var path = require('path');

module.exports = function(ast, filePath, plugins) {
  var errors = [];

  _.each(plugins, function(plugin){
    var results = plugin.test(ast, filePath, plugin.options);

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
      errors.push({
        plugin: _.pick(plugin, ['name', 'message', 'severity']),
        error: result
      });
    });
  });

  return errors || [];
};