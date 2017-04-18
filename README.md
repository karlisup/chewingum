

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
<p align="center">Documentation generator for Pattern Library.</p>
<p align="center">Follow <a href="https://twitter.com/chewingumjs">@chewingumjs</a> on twitter for news & updates.</p>

# Chewingum
From `src` folder it takes each `.twig` template file and by adding 
* description (.md *optional*),
* test data (.json *optional*),
* style (.scss *optional*)
* javascript (.js *optional*)
* demo (.demo.twig *optional*) (thanks to @davbizz )
generates **beautiful preview**

![Component Preview](http://www.neteye-blog.com/wp-content/uploads/2016/08/notification.png)

## Usage
This is how it is used in [Gulp](http://gulpjs.com/).
```javascript
gulp.task('styleguide', function (done) {
  styleguide({
    location: {
      src: 'src/components/',
      dest: 'dest/components/'
    }
  })
})
```

## Options
### opts.location.src
Type: `String` Default: `src/components/`

Sets target for folder from which all the components will be taken.


### opts.filterItems
Type: `Array` Default: `[]`

Pass tabs that filter search results by regular expression. Example: `[{'title': 'Atoms','regex': '01-atoms'}]`.


### opts.location.dest
Type: `String` Default: `dest/components/`

Sets target for Pattern Library output location.


### opts.location.styleguide
Type: `String` Default: `node_modules/chewingum/doc-template/`

Sets target for pattern library templates. It is possible to modify existing pattern library look by moving doc-template to local folder and modifying this URL.



## Developing

 - Clone the github project in a new directory `git clone https://github.com/karlisup/chewingum`
 - Install npm dependencies `npm install`
 - Create a global link to the module `npm link`
 - Create a new project otside the compnent-library-core project
 - Install compnent-library-core in the new project `npm install chewingum`
 - Set the link to the local project `npm link chewingum`


