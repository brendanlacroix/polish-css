#! /usr/bin/env node

var program = require('commander'),
    fs      = require('fs'),
    path    = require('path'),
    polish  = require('./polish');

program
  .version('1.0.0')
  .option('-s, --stylesheet <path>',        'Path to a stylesheet (in CSS, SCSS, Sass, or Less).')
  .option('-P, --plugins-directory <path>', 'Path to a directory of linting plugins')
  .option('-p, --plugins <modules>',          'Comma-separated list of linting plugins', function(modules) { return modules.split(','); })
  .parse(process.argv);

/*
 * Read the provided file and call PolishCSS
 */
fs.readFile(program.stylesheet, 'utf8', function(err, stylesheet) {
  if (err) {
    throw err;
  }

  polish(stylesheet, program.stylesheet, { plugins: program.plugins, pluginsDirectory: program.pluginsDirectory });
});
