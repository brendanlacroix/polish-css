var relative    = require('require-relative'),
    _           = require('lodash');

function getModuleFromConfig(module) {
  if (typeof module === 'string') {
    return relative(module);
  } else if (_.isObject(module)) {
    return module;
  }
}

function isConfigurationTypeValid(option, test) {
  var validOptionValue = false;

  switch (test.type) {
    case 'string':
      validOptionValue = typeof option === 'string';
      break;
    case 'object':
      validOptionValue = typeof option === 'object';
      break;
    case 'array':
      validOptionValue = _.isArray(option);
      break;
    case 'number':
      validOptionValue = _.isNumber(option);
      break;
    case 'boolean':
      validOptionValue = _.isBoolean(option);
      break;
    default:
      validOptionValue = false;
      break;
  }

  return validOptionValue;
}

function configureOptions(options, configurableOption, config) {
  var option = config[configurableOption.name];

  if (!option) {
    option = configurableOption.defaultValue;
  }

  if (!isConfigurationTypeValid(option, configurableOption)) {
    throw new Error('The value of your configuraton for this rule is an invalid data type.');
  }

  options[configurableOption.name] = option;
}

module.exports = function loadPlugins(moduleConfigs) {
  var plugins = {};

  moduleConfigs.forEach(function(config) {
    var loadedModule = _.clone(getModuleFromConfig(config.module), true),
        plugin = {};

    // If plugin is already present in list, bail out.
    if (plugins[loadedModule.name]) {
      return;
    }

    if (!loadedModule.test || !loadedModule.name || !loadedModule.message) {
      throw new Error('Polish plugins must include a name (string), a message (string or function), and a test (function).');
    }

    if (_.isUndefined(config.severity)) {
      config.severity = 2;
    }

    if (!_.contains([0, 1, 2], config.severity)) {
      throw new Error('Severity must be one of the following: 0 (ignore), 1 (warning), 2 (error). If unspecified, it will default to 2.');
    }

    plugin = {
      name     : loadedModule.name,
      test     : loadedModule.test,
      message  : loadedModule.message,
      severity : config.severity,
      options  : {}
    };

    _.each(loadedModule.configOptions, function(configurableOption) {
      configureOptions(plugin.options, configurableOption, config);
    });

    plugins[plugin.name] = plugin;
  });

  return plugins;
};
