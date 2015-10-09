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
      console.error('A module required by one of your rules is missing: ' + e.message);
      process.exit(1);
    } else {
      console.error('The specified rules directory was not found.');
      process.exit(1);
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
      console.error('Only modules prefixed with "polish-plugin-" can be used with Polish.');
      process.exit(1);
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

  return rules;
};
