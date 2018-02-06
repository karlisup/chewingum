

<p align="center">
  <a href="https://travis-ci.org/karlisup/chewingum" title="Build Status">
   <img src="https://img.shields.io/travis/karlisup/chewingum/master.svg?style=flat-square" />
  </a>
  <a href="https://coveralls.io/r/karlisup/chewingum?branch=master" title="Coverage Status">
    <img src="https://img.shields.io/coveralls/karlisup/chewingum.svg?style=flat-square" />
  </a>
  <a href="https://www.npmjs.com/package/chewingum" title="npm">
    <img src="https://img.shields.io/npm/dm/chewingum.svg?style=flat-square" />
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/chewingum" title="NPM version">
    <img src="https://img.shields.io/npm/v/chewingum.svg?style=flat-square" />
  </a>
  <a href="https://david-dm.org/karlisup/chewingum" title="Dependency Status">
    <img src="https://img.shields.io/david/karlisup/chewingum.svg?style=flat-square&label=deps" />
  </a>
  <a href="https://david-dm.org/karlisup/chewingum#info=devDependencies" title="devDependency Status">
    <img src="https://img.shields.io/david/dev/karlisup/chewingum.svg?style=flat-square&label=devDeps" />
  </a>
</p>
<p align="center"><a href="https://www.github.com/karlisup/chewingum"><img src="https://placehold.it/200x125/" /></a></p>
<p align="center"><a href="https://karlisup.github.io/chewingum/demo/partials/lakeside/lakeside.html" target="_blank">Demo</a></p>
<p align="center">Documentation generator for Pattern Library.</p>

## Features
### Template engine agnostic
As it is build upon `node.js` it uses multiple libraries to support various template engines to generate documentation. So far it supported template engines are:
1. `twig`
2. TODO `moustache`
3. TODO `handlebars`

### Use API insted of `Copy`/`Paste`
You can build pattern libraries
1. fast (reuse template, demo data)
2. documented (have demo right beside documentation)
3. link it directly into your project

A component (e.g. `lakeside.twig`):
```twig
<article class="lakeside {{class}}">
  {% if image %}
    <aside class="lakeside__media">
      <img src="image.src" alt="image.alt">
    </aside>
  {% endif %}
  <div class="lakeside__body">
    <div class="lakeside__content">
      {% include 'partials/title/title.twig' with title %}
      {% if summary %}<p class="lakeside__summary long-primer">{{ summary }}</p>{% endif %}
    </div>
    <div class="lakeside__meta">
      {% include 'partials/lists/list-inline.twig' with listItems %}
    </div>
  </div>
  <a href="#" class="lakeside__link" aria-hidden="true" tabindex="-1">{{ title.title }}</a>
</article>
```

Usage (in `news-feed.twig`):
```twig
<div class="row">
  {% for i in 0..2 %}
    <div class="col-sm-4">
      {% include 'partials/lakeside/lakeside.twig' with article %}
    </div>
  {% endfor %}
</div>
```

Test data for demo generation (`lakeside.json`):
```json
{
  "image": {
    "src": "http://placehold.it/800x600/",
    "alt": "placeholder"
  },
  "title": "data@partials/title/title.json",
  "listItems": "data@partials/lists/list-inline.json"
}
```

### Customisable look
Every self-worthy company has their own style guides and design principles they base their designs upon. Chewingum allows you to completely change visual look of the generated documentation to fit your needs.

| Github-like ([Demo](https://karlisup.github.io/chewingum/demo//partials/lakeside/lakeside.html)) |
| :-----------: |
| ![Github theme](https://github.com/karlisup/chewingum/blob/gh-pages/images/theme-github-preview.png) |

## Usage
### Part I
enough to see Chewingum in action
```js
// setting general settings
var src = './pattern-library/'
var dest = './documentation/'

// gulp modules
var gulp = require('gulp')
var chewingum = require('chewingum')
var browserSync = require('browser-sync').create()

// Pattern Library
// For each template file (e.g. breadcrumbs.twig) will build a documentation file.
gulp.task('chewingum', function () {
  chewingum({
    location: {
      src: src,
      dest: dest
    }
  })
})

// Server
// Will build server for patter-library
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: dest
    },
    port: 9999,
    open: false,
    notify: false
  })
})
```

### Part II
add your way to pass style & JavaScript

```js
// for STYLE
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')

// for JavaScript
var concat = require('gulp-concat')

// Style
// Will combine and minify all component styles
gulp.task('style', function (done) {
  return gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest + '/assets/'))
    .pipe(browserSync.stream())
})

// JavaScript
// Will combine and minify all component JavaScript files.
gulp.task('javascript', function (done) {
  return gulp.src(src + '/**/*.js')
    .pipe(concat('components.js'))
    .pipe(gulp.dest(dest + '/assets/'))
})



// FOOTER
// WATCH
gulp.task('watch', function (done) {
  gulp.watch(src + '/**/*.twig', ['chewingum'])
})
// DEFAULT
gulp.task('default', ['chewingum', 'style', 'javascript', 'server', 'watch'])
```


## Options
### opts.location.src
Type: `String` Default: `src/components/`

Sets target for folder from which all the components will be taken.

### opts.location.dest
Type: `String` Default: `dest/components/`

Sets target for Pattern Library output location.

### opts.filterItems
Type: `Array` Default: `[]`

Pass tabs that filter search results by regular expression. Example: `[{'title': 'Atoms','regex': '01-atoms'}]`.

### opts.location.styleguide
Type: `String` Default: `node_modules/chewingum/doc-template/`

Sets target for pattern library templates. It is possible to modify existing pattern library look by moving doc-template to local folder and modifying this URL.


## Contribute
Help us make this project better - [Contributing guide](/CONTRIBUTING.md)!


