var requireDir  = require('require-dir'),
    path        = require('path'),
    _           = require('lodash');

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
