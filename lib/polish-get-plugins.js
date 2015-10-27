var requireDir  = require('require-dir');
var path        = require('path');
var _           = require('lodash');

function getPluginDirectory(directory) {
  var rules = {},
      ruleFiles;

  try {
    // Require the entire rules directory
    ruleFiles = requireDir(path.join(process.cwd(), directory));
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error('A module required by one of your rules is missing: ' + e.message);
    } else {
      throw new Error('The specified rules directory was not found.');

    }
  }

  // Only test with rules that have an error message and a test that is a function.
  _.each(ruleFiles, function(rule, name){
    if (rule.message && rule.test && typeof rule.test === 'function') {
      rules[name] = rule;
      rules[name].name = name;
    }
  });

  return rules;
}

function getPluginModules(modules) {
  var rules = {};

  _.each(modules, function(plugin){
    if (plugin.indexOf('polish-plugin-') !== 0){
      throw new Error('Only modules prefixed with "polish-plugin-" can be used with Polish.');
    }

    var rule = require(path.join(process.cwd(), 'node_modules', plugin)),
        name = plugin.replace('polish-plugin-', '');

    // Only test with rules that have an error message and a test that is a function.
    if (rule.message && rule.test && typeof rule.test === 'function') {
      rules[name] = rule;
      rules[name].name = name;
    }
  });

  return rules;
}

module.exports = function getPlugins(modules, directory, ignoredPlugins) {
  var rules = {};

  if (modules) {
    _.extend(rules, getPluginModules(modules));
  }

  if (directory) {
    _.extend(rules, getPluginDirectory(directory));
  }

  if (ignoredPlugins) {
    _.each(ignoredPlugins, function(plugin) {
      delete rules[plugin];
    });
  }

  // If there are no plugins, there's no need to continue.
  if (!Object.keys(rules).length) {
    throw new Error('No plugins were found.');
  }

  return rules;
};
