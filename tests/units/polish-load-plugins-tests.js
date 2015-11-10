define([
    'require',
    'intern/chai!',
    'intern/dojo/node!sinon-chai',
    'intern/dojo/node!sinon',
    'intern/dojo/node!../../lib/polish-load-plugins',
    'intern/dojo/node!lodash'
  ],
  function (require, chai, sinonChai, sinon, loadPlugins, _) {
    var registerSuite     = require('intern!object'),
        assert            = require('intern/chai!assert'),
        fs                = require('intern/dojo/node!fs'),
        polish            = require('intern/dojo/node!../../lib/polish');

    chai.use(sinonChai);

    registerSuite(function() {
      var configuration;

      return {
        name: 'polish-load-plugins',

        beforeEach: function() {
          configuration = [
            { module: 'polish-no-styling-ids', severity: 2 },
            { module: 'polish-no-styling-elements', severity: 2 },
            {
              module: {
                configOptions : [
                  {
                    type         : 'array',
                    name         : 'selectors',
                    defaultValue : []
                  }
                ],
                name: 'banned-selectors',
                message : function(error) {},
                test: function() {}
              },
              severity: 2,
              selectors: [
                '.icon-xsmall',
                '.menu',
                '.cover',
                '.img'
              ]
            }
          ];
        },

        'test that plugin modules can be a require-able string': function() {
          var requireablePlugin = [configuration[0]],
              plugins           = loadPlugins(requireablePlugin);

          assert.equal(Object.keys(plugins).length, 1);
          assert.ok(plugins['no-styling-ids']);

          assert.property(plugins['no-styling-ids'], 'test');
          assert.isFunction(plugins['no-styling-ids'].test);

          assert.property(plugins['no-styling-ids'], 'message');
          assert.isString(plugins['no-styling-ids'].message);

          assert.property(plugins['no-styling-ids'], 'name');
          assert.isString(plugins['no-styling-ids'].name);

          assert.property(plugins['no-styling-ids'], 'severity');
          assert.isNumber(plugins['no-styling-ids'].severity);

          assert.isObject(plugins['no-styling-ids'].options);
          assert.equal(Object.keys(plugins['no-styling-ids'].options).length, 0);
        },
        'test that plugin modules can be a preloaded module': function() {
          var preloadedModule   = configuration[2],
              requireablePlugin = [preloadedModule],
              plugins           = loadPlugins(requireablePlugin);

          assert.equal(Object.keys(plugins).length, 1);
          assert.ok(plugins['banned-selectors']);

          assert.property(plugins['banned-selectors'], 'test');
          assert.isFunction(plugins['banned-selectors'].test);

          assert.property(plugins['banned-selectors'], 'message');
          assert.isFunction(plugins['banned-selectors'].message);

          assert.property(plugins['banned-selectors'], 'name');
          assert.isString(plugins['banned-selectors'].name);

          assert.property(plugins['banned-selectors'], 'severity');
          assert.isNumber(plugins['banned-selectors'].severity);

          assert.notProperty(plugins['banned-selectors'], 'selectors');
          assert.notProperty(plugins['banned-selectors'], 'configOptions');

          assert.isObject(plugins['banned-selectors'].options);
          assert.equal(Object.keys(plugins['banned-selectors'].options).length, 1);
          assert.isArray(plugins['banned-selectors'].options.selectors);
        },
        'test that multiple modules are loaded successfully': function() {
          var requireablePlugins = [configuration[0], configuration[1], configuration[2]],
              plugins            = loadPlugins(requireablePlugins);

          assert.equal(Object.keys(plugins).length, 3);
          assert.ok(plugins['no-styling-ids']);
          assert.ok(plugins['no-styling-elements']);
          assert.ok(plugins['banned-selectors']);
        },
        'test that a single rule cannot be configured multiple times': function() {
          var requireAndRequirePlugins     = [configuration[0], configuration[0]],
              requireAndPreloadedPlugins   = [],
              preloadedAndPreloadedPlugins = [configuration[2], configuration[2]],
              requireAndRequire            = loadPlugins(requireAndRequirePlugins),
              preloadedAndPreloaded        = loadPlugins(preloadedAndPreloadedPlugins),
              fakePreloadedPlugin          = _.clone(configuration[2], true),
              requireAndPreloaded;

          fakePreloadedPlugin.module.name = 'no-styling-ids';

          requireAndPreloadedPlugins = [configuration[0], fakePreloadedPlugin];
          requireAndPreloaded = loadPlugins(requireAndPreloadedPlugins);

          assert.equal(Object.keys(requireAndRequire).length, 1);
          assert.equal(Object.keys(requireAndPreloaded).length, 1);
          assert.equal(Object.keys(preloadedAndPreloaded).length, 1);
        },
        'test that plugins without the required exports throw an error': function() {
          var loadedPlugin       = loadPlugins([configuration[0]]),
              namelessPlugin     = {
                test: function() {},
                message: 'some-message'
              },
              messagelessPlugin  = {
                name: 'some-plugin',
                test: function() {}
              },
              testlessPlugin     = {
                name: 'some-plugin',
                message: 'some-message'
              },
              namelessFailure    = '',
              messagelessFailure = '',
              testlessFailure    = '';

          try {
            loadPlugins([{ module: namelessPlugin, severity: 2 }]);
          } catch(e) {
            namelessFailure = e.message;
          }
          try {
            loadPlugins([{ module: messagelessPlugin, severity: 2 }]);
          } catch(e) {
            messagelessFailure = e.message;
          }
          try {
            loadPlugins([{ module: testlessPlugin, severity: 2 }]);
          } catch(e) {
            testlessFailure = e.message;
          }

          assert.equal(namelessFailure, 'Polish plugins must include a name (string), a message (string or function), and a test (function).');
          assert.equal(messagelessFailure, 'Polish plugins must include a name (string), a message (string or function), and a test (function).');
          assert.equal(testlessFailure, 'Polish plugins must include a name (string), a message (string or function), and a test (function).');
        },
        'test that the severity must be 0, 1, or 2 and will be defaulted if not set': function() {
          var severityFailure = '',
              defaultedSeverity = loadPlugins([{ module: 'polish-no-styling-ids' }]);

          try {
            loadPlugins([{ module: 'polish-no-styling-ids', severity: 5 }]);
          } catch(e) {
            severityFailure = e.message;
          }

          assert.equal(severityFailure, 'Severity must be one of the following: 0 (ignore), 1 (warning), 2 (error). If unspecified, it will default to 2.');
          assert.equal(defaultedSeverity['no-styling-ids'].severity, 2);
        },
        'test that options using the wrong data type throw an error': function() {
          var presentIncorrectTypePlugin = _.clone(configuration[2], true),
              presentIncorrectType;

          presentIncorrectTypePlugin.selectors = 'this should be an array, not a string.';

          try {
            loadPlugins([presentIncorrectTypePlugin]);
          } catch(e) {
            presentIncorrectType = e.message;
          }

          // Options that are the wrong datatype should throw an error.
          assert.equal(presentIncorrectType, 'The value of your configuraton for this rule is an invalid data type.');
        },
        'test that unspecified options that should be present should use a default value': function() {
          var missingOptionPlugin = _.clone(configuration[2], true),
              missingOption;

          delete missingOptionPlugin.selectors;

          missingOption = loadPlugins([missingOptionPlugin]);

          assert.isArray(missingOption['banned-selectors'].options.selectors);
          assert.lengthOf(missingOption['banned-selectors'].options.selectors, 0);
        },
        'test that options passed in that are not in the configOptions array should be discarded': function() {
          var unconfiguredOptionPlugin = _.clone(configuration[2], true),
              unconfiguredOption;

          unconfiguredOption = loadPlugins([unconfiguredOptionPlugin]);

          unconfiguredOptionPlugin.notAnOption = 'this should be stripped out.';

          assert.isObject(unconfiguredOption['banned-selectors'].options);
          assert.notProperty(unconfiguredOption['banned-selectors'].options, 'notAnOption');
        },
        'test that valid configurations are added to an options object': function() {
          var validOption = loadPlugins([configuration[2]]);

          assert.isObject(validOption['banned-selectors'].options);
          assert.property(validOption['banned-selectors'].options, 'selectors');
        }
      };
    });
  }
);
