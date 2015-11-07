define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      fs            = require('intern/dojo/node!fs'),
      polish        = require('intern/dojo/node!../../lib/polish');

  registerSuite({
    name: 'polish',
    'test that an error is thrown without plugins specified': function() {
      var deferred = this.async(3000);

      fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        try {
          polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', []);
        } catch(e) {
          assert.strictEqual(e.message, 'Polish requires a list of plugins. Please add some plugin modules to your config.');
        }
      }));
    },
    'test that an error is thrown on empty stylesheets': function() {
      var deferred = this.async(3000);

      fs.readFile('./tests/test_helpers/empty.css', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        try {
          polish(stylesheet.toString('utf8'), './tests/test_helpers/empty.css', [ { module: 'polish-something', severity: 2 } ]);
        } catch(e) {
          assert.strictEqual(e.message, 'Polish cannot lint empty files: ./tests/test_helpers/empty.css');
        }
      }));
    },
    'test that plugins work': function() {
      var deferred = this.async(3000),
          results;

      fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        results = polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', [ { module: 'polish-no-styling-ids', severity: 2 } ]);

        assert.isObject(results);
        assert.strictEqual(results.errors.length, 1);
        assert.isObject(results.errors[0]);
        assert.property(results.errors[0], 'plugin');
        assert.property(results.errors[0].plugin, 'name');
        assert.property(results.errors[0].plugin, 'message');
        assert.property(results.errors[0], 'error');
        assert.property(results.errors[0].error, 'node');
      }));
    },
    'test that helper methods are exported': function() {
      assert.property(polish, 'reporter');
    }
  });
});
