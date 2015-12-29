define([
    'require',
    'intern/chai!',
    'intern/dojo/node!sinon-chai',
    'intern/dojo/node!sinon',
    'intern/dojo/node!../../lib/polish-process-stylesheet'
  ],
  function (require, chai, sinonChai, sinon, processStylesheet) {
    var registerSuite = require('intern!object'),
        assert        = require('intern/chai!assert'),
        fs            = require('intern/dojo/node!fs'),
        polish        = require('intern/dojo/node!../../lib/polish');

    chai.use(sinonChai);

    registerSuite(function() {
      return {
        name: 'polish-get-inline-configs',

        'test polish-disable disables all rules until the end of the file': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-whole-file.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-whole-file.css');

            assert.isFalse(ast.content[0]._polishIgnore); // first comment
            assert.isTrue(ast.content[1]._polishIgnore);
            assert.isTrue(ast.content[2]._polishIgnore);
          }));
        },
        'test that polish-disable disables all rules until a polish-enable is found': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-between.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-between.css');

            assert.isFalse(ast.content[0]._polishIgnore); // first comment
            assert.isTrue(ast.content[1]._polishIgnore); // space
            assert.isTrue(ast.content[2]._polishIgnore); // ruleset
            assert.isTrue(ast.content[3]._polishIgnore); // space
            assert.isFalse(ast.content[4]._polishIgnore); // second comment
            assert.isFalse(ast.content[5]._polishIgnore); // space
            assert.isFalse(ast.content[6]._polishIgnore); // ruleset
          }));
        },
        'test that polish-disable can be passed a list of rules to disable': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-with-rule-names.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-with-rule-names.css');

            assert.isFalse(ast.content[0]._polishIgnore); // first comment
            assert.sameMembers(ast.content[2].content[0]._polishIgnore, ['no-bang-important']); // first child of the ruleset
            assert.sameMembers(ast.content[6]._polishIgnore, ['no-bang-important','no-styling-ids']); // second ruleset
            assert.isTrue(ast.content[10]._polishIgnore); // third ruleset
          }));
        },
        'test that polish-disable disables the passed list of rules until a polish-enable is found': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-between.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-between.css');

            assert.isFalse(ast.content[8]._polishIgnore); // third comment
            assert.sameMembers(ast.content[10]._polishIgnore, ['no-styling-ids']); // third ruleset
            assert.sameMembers(ast.content[10].content[0]._polishIgnore, ['no-styling-ids']); // child of third ruleset
            assert.isFalse(ast.content[12]._polishIgnore); // fourth comment
            assert.isFalse(ast.content[14]._polishIgnore); // fourth ruleset
            assert.isFalse(ast.content[14].content[0]._polishIgnore); // child of fourth ruleset
          }));
        },
        'test that polish-enable can be passed a list of rules to re-enable' : function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-between.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-between.css');

            assert.isFalse(ast.content[16]._polishIgnore); // fifth comment
            assert.sameMembers(ast.content[18]._polishIgnore, ['no-styling-ids', 'no-bang-important']); // fifth ruleset
            assert.sameMembers(ast.content[18].content[0]._polishIgnore, ['no-styling-ids', 'no-bang-important']); // child of fifth ruleset
            assert.sameMembers(ast.content[22]._polishIgnore, ['no-bang-important']); // fourth ruleset
            assert.sameMembers(ast.content[22].content[0]._polishIgnore, ['no-bang-important']); // child of fourth ruleset
          }));
        },
        'test that polish-disable-line disables a single line': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-single-line.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-single-line.css');

            assert.isTrue(ast.content[0].content[0]._polishIgnore);
            assert.isFalse(ast.content[0].content[1]._polishIgnore);
            assert.isFalse(ast.content[2].content[0]._polishIgnore);
            assert.isFalse(ast.content[2].content[0]._polishIgnore);
            assert.isFalse(ast.content[2].content[1].content[0]._polishIgnore);
            assert.isTrue(ast.content[2].content[1].content[1]._polishIgnore);
            assert.isTrue(ast.content[2].content[1].content[2]._polishIgnore);
            assert.isTrue(ast.content[2].content[1].content[3]._polishIgnore);
            assert.isTrue(ast.content[2].content[1].content[4]._polishIgnore);
            assert.isTrue(ast.content[2].content[1].content[5]._polishIgnore);
          }));
        },
        'test that polish-disable-line can be passed a list of rules to disable on a single line': function() {
          var deferred = this.async(3000),
              ast,
              output;

          fs.readFile('./tests/test_helpers/inline-configs-helpers/disable-single-line.css', deferred.callback(function(error, stylesheet) {
            if (error) {
              throw error;
            }

            ast = processStylesheet(stylesheet.toString('utf8'), './tests/test_helpers/inline-configs-helpers/disable-single-line.css');

            assert.sameMembers(ast.content[4].content[0]._polishIgnore, ['no-styling-ids']);
            assert.isFalse(ast.content[4].content[1]._polishIgnore);
          }));
        },
        // 'test that polish can be passed configurations in a comment': function() {},
        // 'test that polish can be passed a new severity in a comment': function() {}
      };
    });
  }
);
