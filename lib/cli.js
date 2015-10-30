#! /usr/bin/env node

var program = require('commander'),
    fs      = require('fs'),
    path    = require('path'),
    polish  = require('./polish');

program
  .version('1.0.0')
  .option('-s, --stylesheet <path>',        'Path to a stylesheet (in CSS, SCSS, Sass, or Less).')
  .option('-p, --plugins <modules>',        'Comma-separated list of linting plugins.', function(modules) { return modules.split(','); })
  .option('-q, --quiet',                    'Prevent logging errors to the console.')
  .parse(process.argv);

/*
 * Read the provided file and call PolishCSS
 */
fs.readFile(program.stylesheet, 'utf8', function(err, stylesheet) {
  var results,
      config = {};

  if (err) {
    throw err;
  }

  program.plugins.forEach(function(plugin) {
    config[plugin] = [2];
  });

  results = polish(stylesheet, program.stylesheet, { config: config });

  if (!program.quiet) {
    polish.reporter(results);
  }
});
