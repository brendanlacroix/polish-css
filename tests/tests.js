define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      fs            = require('intern/dojo/node!fs'),
      plugins       = require('intern/dojo/node!../tests/test_helpers/plugins'),
      polish        = require('intern/dojo/node!../lib/polish'),
      gonzales      = require('intern/dojo/node!../node_modules/gonzales-pe');

  registerSuite({
    name: 'polish',
    'test that PolishCSS errors without plugins specified': function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        try {
          polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', {});
        } catch(e) {
          assert.strictEqual(e.message, 'Polish requires a list of plugins. Please specify a list of modules or the path to a directory containing a set of plugins.');
        }
      }));
    },
    'test that PolishCSS errors on empty stylesheets': function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/test_helpers/empty.css', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        try {
          polish(stylesheet.toString('utf8'), './tests/test_helpers/empty.css', { plugins: ['polish-plugin-something'] });
        } catch(e) {
          assert.strictEqual(e.message, 'Polish cannot lint empty files: ./tests/test_helpers/empty.css');
        }
      }));
    }
  });
});
