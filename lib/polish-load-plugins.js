var requireDir  = require('require-dir'),
    path        = require('path'),
    _           = require('lodash');

module.exports = function loadPlugins(moduleConfigs) {
  var plugins = {};

  _.each(moduleConfigs, function(config){
    var plugin;

    if (typeof config.module === 'string') {
      plugin = require(path.join(process.cwd(), 'node_modules', config.module));
    } else if (_.isObject(config.module) && !_.isArray(config.module)) {
      plugin = config.module;
    }

    if (!plugin.name || !plugin.message || !plugin.test || typeof plugin.test !== 'function') {
      throw new Error('Polish plugins must include a name (string), a message (string or function), and a test (function).');
    }

    config.severity = config.severity || 2;

    if (!_.contains([0, 1, 2], config.severity)){
      throw new Error('Severity must be one of the following: 0 (ignore), 1 (warning), 2 (error). Default is 2.');
    }

    plugins[plugin.name] = plugin;
    plugins[plugin.name].severity = config.severity;
    plugins[plugin.name].options = {};

    _.each(plugin.configOptions, function(option) {
      var optionName       = _.keys(option)[0],
          optionType       = option[optionName],
          optionValue      = config[optionName],
          validOptionValue = false;


      switch (optionType) {
        case 'string':
          validOptionValue = typeof optionValue === 'string';
          break;
        case 'object':
          validOptionValue = typeof optionValue === 'object';
          break;
        case 'array':
          validOptionValue = _.isArray(optionValue);
          break;
        case 'number':
          validOptionValue = _.isNumber(optionValue);
          break;
        case 'boolean':
          validOptionValue = _.isBoolean(optionValue);
          break;
        default:
          validOptionValue = false;
          break;
      }

      if (validOptionValue) {
        plugins[plugin.name].options[optionName] = optionValue;
      } else {
        throw new Error('The value of your configuraton for this rule is an invalid data type.');
      }
    });
  });

  return plugins;
};
