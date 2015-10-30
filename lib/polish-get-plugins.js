var requireDir  = require('require-dir'),
    path        = require('path'),
    _           = require('lodash');

function getPluginModules(modules) {
  var plugins = {};

  _.each(modules, function(moduleSettings, moduleName){
    var plugin,
        name;

    if (moduleName.indexOf('polish-plugin-') !== 0){
      throw new Error('Only modules prefixed with "polish-plugin-" can be used with Polish.');
    }

    plugin = require(path.join(process.cwd(), 'node_modules', moduleName));
    name   = moduleName.replace('polish-plugin-', '');

    // Only test with plugins that have an error message and a test that is a function.
    if (plugin.message && plugin.test && typeof plugin.test === 'function') {
      plugins[name] = plugin;
      plugins[name].name = name;

      if (!_.contains([0, 1, 2], moduleSettings[0])){
        throw new Error('Severity values must be one of the following: 0 (ignore), 1 (warning), 2 (error).');
      }

      plugins[name].severity = moduleSettings[0];

      _.each(plugin.configOptions, function(option) {
        var optionName = _.keys(option)[0],
            optionType = option[optionName],
            optionValue = moduleSettings[1][optionName],
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
          plugins[name].options = moduleSettings[1];
        } else {
          throw new Error('The value of your configuraton for this rule is an invalid data type.');
        }
      });
    }
  });

  return plugins;
}

module.exports = function getPlugins(modules, ignoredPlugins) {
  var plugins = {};

  if (modules) {
    _.extend(plugins, getPluginModules(modules));
  }

  if (ignoredPlugins) {
    _.each(ignoredPlugins, function(plugin) {
      delete plugins[plugin];
    });
  }

  return plugins;
};
