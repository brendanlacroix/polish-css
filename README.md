# PolishCSS :nail_care:

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

Play by your own rules with PolishCSS.

**Features:**
:nail_care: Totally unopinionated. No default linters.
:nail_care: Totally plugin based.
:nail_care: Totally named in honor of the nail polish emoji.

_PolishCSS works with CSS, SCSS, Sass, and Less._

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

If you want to use the CLI, install PolishCSS globally:
`npm install -g polish-css`


## <a name="resources"></a>Resources
- [Writing linters](https://github.com/brendanlacroix/polish-css/wiki/Writing-linters)
- [Using results](https://github.com/brendanlacroix/polish-css/wiki/Using-results)
- [Command line use](https://github.com/brendanlacroix/polish-css/wiki/Command-line-usage)


## <a name="license"></a>License
This project is licensed under the terms of the MIT license.