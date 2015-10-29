var _    = require('lodash');
var path = require('path');

module.exports = function(stylesheet, plugins) {
  var errors = [];

  _.each(plugins, function(plugin){
    var results = plugin.test(stylesheet);

    if (!results || !results.length || !_.isArray(results)){
      return;
    }

    // Remove failures that are on plugins with inline configs
    _.each(results, function (result){
      if (!result.rule || !result.rule.ruleConfig) {
        return;
      }

      if (result.rule.ruleConfig[plugin.name] === false) {
        results = _.without(results, result);
      }
    });

    _.each(results, function(result){
      errors.push({
        rule: _.pick(rule, ['name', 'message']),
        data   : result
      });
    });
  });

  return errors || [];
};