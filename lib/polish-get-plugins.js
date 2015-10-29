var requireDir  = require('require-dir'),
    path        = require('path'),
    _           = require('lodash');

function getPluginDirectory(directory) {
  var plugins = {},
      files;

  try {
    // Require the entire plugins directory
    files = requireDir(path.join(process.cwd(), directory));
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error('A module required by one of your plugins is missing: ' + e.message);
    } else {
      throw new Error('The specified plugins directory was not found.');

    }
  }

  // Only test with plugins that have an error message and a test that is a function.
  _.each(files, function(plugin, name){
    if (plugin.message && plugin.test && typeof plugin.test === 'function') {
      plugins[name] = plugin;
      plugins[name].name = name;
    }
  });

  return plugins;
}

function getPluginModules(modules) {
  var plugins = {};

  _.each(modules, function(module){
    var plugin,
        name;

    if (module.indexOf('polish-plugin-') !== 0){
      throw new Error('Only modules prefixed with "polish-plugin-" can be used with Polish.');
    }

    plugin = require(path.join(process.cwd(), 'node_modules', module));
    name   = module.replace('polish-plugin-', '');

    // Only test with plugins that have an error message and a test that is a function.
    if (plugin.message && plugin.test && typeof plugin.test === 'function') {
      plugins[name] = plugin;
      plugins[name].name = name;
    }
  });

  return plugins;
}

module.exports = function getPlugins(modules, directory, ignoredPlugins) {
  var plugins = {};

  if (modules) {
    _.extend(plugins, getPluginModules(modules));
  }

  if (directory) {
    _.extend(plugins, getPluginDirectory(directory));
  }

  if (ignoredPlugins) {
    _.each(ignoredPlugins, function(plugin) {
      delete plugins[plugin];
    });
  }

  // If there are no plugins, there's no need to continue.
  if (!Object.keys(plugins).length) {
    throw new Error('No plugins were found.');
  }

  return plugins;
};
