# Polish

[![Build Status](https://travis-ci.org/brendanlacroix/polish-css.svg)](https://travis-ci.org/brendanlacroix/polish-css) [![codecov.io](https://codecov.io/github/brendanlacroix/polish-css/coverage.svg?branch=master)](https://codecov.io/github/brendanlacroix/polish-css?branch=master)

- [Overview](#overview)
- [Quick start](#quickstart)
- [Installation](#installation)
- [Resources](#resources)
- [License](#license)

## <a name="overview"></a>Overview

Spend less time reviewing pull requests.
Make learning your rules simpler for new additions to the team.
Keep your code more consistent and more reliable...

Or don't. You're the boss.

Manicure your CSS with Polish.

**Features:**
- Totally unopinionated. No default linters.
- Totally plugin based.
- Totally named in honor of the nail polish emoji.

_Polish works with CSS, SCSS, Sass, and Less._

## <a name="quickstart"></a>Quick start

Do this:

`var polish = require('polish-css');`

Then do this:
```javascript
var stylesheet       = '#css { color: red; }',
    pathToStylesheet = '/path/to/stylesheet',
    pluginsToUse     = ['polish-plugin-no-styling-ids'],
    errors;

errors = polish(stylesheet, pathToStylesheet, { plugins: pluginsToUse });

polish.reporter(pathToStylesheet, errors);
```

Linters can be ignored on a per-ruleset basis using inline commenting:
```css
/* polish no-styling-ids=false */
#wont-be-reported {
  color: pink;
}
```

## <a name="installation"></a>Installation
Install from [npm](https://www.npmjs.com/package/polish-css):
`npm install polish-css`

If you want to use the CLI, install Polish globally:
`npm install -g polish-css`


## <a name="resources"></a>Resources
- [Writing linters](https://github.com/brendanlacroix/polish-css/wiki/Writing-linters)
- [Using results](https://github.com/brendanlacroix/polish-css/wiki/Using-results)
- [Command line use](https://github.com/brendanlacroix/polish-css/wiki/Command-line-usage)


## <a name="license"></a>License
This project is licensed under the terms of the MIT license.
