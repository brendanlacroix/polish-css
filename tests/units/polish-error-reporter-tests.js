define(['require', 'intern/chai!', 'intern/dojo/node!sinon-chai', 'intern/dojo/node!sinon'], function (require, chai, sinonChai, sinon) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      fs            = require('intern/dojo/node!fs'),
      polish        = require('intern/dojo/node!../../lib/polish');

  chai.use(sinonChai);

  registerSuite(function() {
    var consoleLogStub;

    return {
      name: 'polish-error-reporter',

      beforeEach: function() {
        consoleLogStub = sinon.stub(console, 'log');
      },
      afterEach: function() {
        consoleLogStub.restore();
      },

      'test that it does not report if there are no errors': function() {
        var deferred = this.async(3000),
            results;

        fs.readFile('./tests/test_helpers/no-errors.css', deferred.callback(function(error, stylesheet) {
          if (error) {
            throw error;
          }

          results = polish(stylesheet.toString('utf8'), './tests/test_helpers/no-errors.css', { plugins: ['polish-plugin-no-styling-ids','polish-plugin-no-styling-elements'], ignoredPlugins: ['no-styling-elements'] });

          polish.reporter(results);

          chai.expect(consoleLogStub).to.not.be.called;
        }));
      },
      'test that it reports an error': function() {
        var deferred = this.async(3000),
            results;

        fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
          if (error) {
            throw error;
          }

          results = polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', { plugins: ['polish-plugin-no-styling-ids'] });

          polish.reporter(results);

          chai.expect(consoleLogStub).to.be.calledOnce;
          /* should report the filename */
          chai.expect(consoleLogStub).and.calledWithMatch(results.filePath);
          /* should report the line number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('line ' + results.errors[0].data.rule.start.line);
          /* should report the column number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('col ' + results.errors[0].data.rule.start.column);
          /* should report the failed node as a string */
          chai.expect(consoleLogStub).to.be.calledWithMatch('#no-styling-ids { color: red;}');
          /* should report the error message */
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[0].rule.message);
        }));
      },
      'test that it reports multiple errors grouped under the filename': function() {
        var deferred = this.async(3000),
            results;

        fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
          if (error) {
            throw error;
          }

          results = polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', { plugins: ['polish-plugin-no-styling-ids','polish-plugin-no-styling-elements'] });

          polish.reporter(results);

          chai.expect(consoleLogStub).to.be.calledOnce;
          /* should report the filename */
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.filePath);
          /* should report the line number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('line ' + results.errors[0].data.rule.start.line);
          chai.expect(consoleLogStub).to.be.calledWithMatch('line ' + results.errors[1].data.rule.start.line);
          /* should report the column number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('col ' + results.errors[0].data.rule.start.column);
          chai.expect(consoleLogStub).to.be.calledWithMatch('col ' + results.errors[1].data.rule.start.column);
          /* should report the failed node as a string */
          chai.expect(consoleLogStub).to.be.calledWithMatch('#no-styling-ids { color: red;}');
          chai.expect(consoleLogStub).to.be.calledWithMatch('div');
          /* should report the error message */
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[0].rule.message);
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[1].rule.message);
        }));
      },
      'test that it reports both file-level and node-level errors': function() {
          var deferred = this.async(3000),
              results;

        fs.readFile('./tests/test_helpers/scss.scss', deferred.callback(function(error, stylesheet) {
          if (error) {
            throw error;
          }

          results = polish(stylesheet.toString('utf8'), './tests/test_helpers/scss.scss', { plugins: ['polish-plugin-no-styling-ids','polish-plugin-no-styling-elements','polish-plugin-match-stylesheet-names-to-rules'] });

          polish.reporter(results);

          chai.expect(consoleLogStub).to.be.calledOnce;
          /* should report the filename */
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.filePath);
          /* should report the line number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('line ' + results.errors[0].data.rule.start.line);
          chai.expect(consoleLogStub).to.be.calledWithMatch('line ' + results.errors[1].data.rule.start.line);
          /* should report the column number */
          chai.expect(consoleLogStub).to.be.calledWithMatch('col ' + results.errors[0].data.rule.start.column);
          chai.expect(consoleLogStub).to.be.calledWithMatch('col ' + results.errors[1].data.rule.start.column);
          /* should report the failed node as a string */
          chai.expect(consoleLogStub).to.be.calledWithMatch('#no-styling-ids { color: red;}');
          chai.expect(consoleLogStub).to.be.calledWithMatch('div');
          chai.expect(consoleLogStub).to.be.calledWithMatch('File warning:');
          /* should report the error message */
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[0].rule.message);
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[1].rule.message);
          chai.expect(consoleLogStub).to.be.calledWithMatch(results.errors[2].rule.message({
            data : {
              errorName: 'failed_on_multiple',
              message: ''
            }
          }));
        }));
      }
    };
  });
});
