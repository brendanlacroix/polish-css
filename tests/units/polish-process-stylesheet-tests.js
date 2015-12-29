define([
    'require',
    'intern/chai!',
    'intern/dojo/node!sinon-chai',
    'intern/dojo/node!sinon',
    'intern/dojo/node!../../lib/polish-process-stylesheet'
  ],
  function (require, chai, sinonChai, sinon, processStylesheet) {
    var registerSuite     = require('intern!object'),
        assert            = require('intern/chai!assert'),
        fs                = require('intern/dojo/node!fs'),
        polish            = require('intern/dojo/node!../../lib/polish');

    chai.use(sinonChai);

    registerSuite(function() {
      return {
        name: 'polish-process-stylesheet',

        'test that an error is thrown on non-CSS, SCSS, Sass, or LESS files': function() {
          var deferred = this.async(3000),
              output;

          fs.readFile('./tests/test_helpers/not-a-stylesheet.js', deferred.callback(function(error, notStylesheet) {
            if (error) {
              throw error;
            }

            try {
              output = processStylesheet(notStylesheet.toString('utf8'), './tests/test_helpers/not-a-stylesheet.js');
            } catch(e) {
              assert.strictEqual(e.message, 'Polish only accepts css, scss, sass, and less files.');
            }
          }));
        },
        'test that the output has the file name and the AST': function() {
          var deferred = this.async(3000),
              output;

          fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            output = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss');

            assert.isObject(output);
            assert.isFunction(output.traverse);
          }));
        }
      };
    });
  }
);
