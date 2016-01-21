![Polish. Give your stylesheets a manicure.](/../images/images/polish-header.png)

[![Build Status](https://travis-ci.org/brendanlacroix/polish-css.svg?branch=master)](https://travis-ci.org/brendanlacroix/polish-css) [![codecov.io](https://codecov.io/github/brendanlacroix/polish-css/coverage.svg?branch=master)](https://codecov.io/github/brendanlacroix/polish-css?branch=master) [![bitHound Score](https://www.bithound.io/github/brendanlacroix/polish-css/badges/score.svg)](https://www.bithound.io/github/brendanlacroix/polish-css) [![bitHound Dependencies](https://www.bithound.io/github/brendanlacroix/polish-css/badges/dependencies.svg)](https://www.bithound.io/github/brendanlacroix/polish-css/master/dependencies/npm)

- [Overview](#overview)
- [Quick start](#quickstart)
- [Installation](#installation)
- [Example plugins](#plugins)
- [License](#license)

## <a name="overview"></a>Overview

Spend less time reviewing pull requests.
Make learning your rules simpler for new additions to the team.
Keep your code more consistent and more reliable...

Or don't. You're the boss.

Manicure your CSS with Polish.

**Features:**
- Totally unopinionated.
- Totally plugin based.
- Totally named in honor of the nail polish emoji.

_Polish works with CSS, SCSS, Sass, and Less._

## <a name="quickstart"></a>Quickstart

Do this:

`var polish = require('polish-css');`

Then do this:
```javascript
var stylesheet       = '#css { color: red; }',
    pathToStylesheet = '/path/to/stylesheet',
    myPrivateModules = require('./path/to/private/modules'),
    pluginsToUse     = [
      {
        module   : 'polish-no-styling-ids',
        severity : 2
      },
      {
        module        : myPrivateModules.someLinter,
        severity      : 2,
        lintingOption : ['.things', '.to', '.pass', '.to', '.the', '.linter']
      }
    ],
    results;

results = polish(stylesheet, pathToStylesheet, pluginsToUse);

polish.reporter(pathToStylesheet, results.errors, results.warnings);
```

Linters can be ignored using inline commenting:

To disable a block of comments, use `/* polish-disable */` and `/* polish-enable */`.
```css
/* polish-disable */
.polish-is-entirely-disabled-here {
  color: green;
}
/* polish-enable */
```

To disable a specific rule for a range of comments, use the same syntax as above with a comma-separated
list of plugins to disable `/* polish-disable no-styling-ids, no-styling-elements */`. They can be individually
re-enabled using `/* polish-enable no-styling-elements */`.

To disable an individual line, use `/* polish-disable-line */`. It also can accept a comma-separated list of plugins.


## <a name="installation"></a>Installation
Install from [npm](https://www.npmjs.com/package/polish-css):
`npm install polish-css`

If you want to use the CLI, install Polish globally:
`npm install -g polish-css`


## <a name="plugins"></a>Example plugins
- *[polish-banned-selectors](https://github.com/brendanlacroix/polish-banned-selectors)* Ban a list of selectors.
- *[polish-no-added-typography](https://github.com/brendanlacroix/polish-no-added-typography)* Prevent redefining typographic rules throughout your stylesheets.
- *[polish-use-color-variables](https://github.com/brendanlacroix/polish-use-color-variables)* Enforce defining your colors as variables (for Sass and SCSS).
- *[polish-use-box-shadow-mixin](https://github.com/brendanlacroix/polish-use-box-shadow-mixin)* Enforce using a mixin to make box shadows (for Sass and SCSS).
- *[polish-no-calc-in-bg-position](https://github.com/brendanlacroix/polish-no-calc-in-bg-position)* Ban using `calc` in `background-position` (it crashes older IE versions).
- *[polish-no-styling-ids](https://github.com/brendanlacroix/polish-no-styling-ids)* Don't allow styling IDs.
- *[polish-only-extend-placeholders](https://github.com/brendanlacroix/polish-only-extend-placeholders)* Make sure `@extend` is only used with placeholders (for Sass and SCSS).
- *[polish-no-bang-important](https://github.com/brendanlacroix/polish-no-bang-important)* Don't let anyone use `!important`.


## <a name="license"></a>License
This project is licensed under the terms of the MIT license.
