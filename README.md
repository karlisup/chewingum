[![Build Status](https://travis-ci.org/karlisup/chewingum.svg?branch=master)](https://travis-ci.org/karlisup/chewingum)
[![Coverage Status](https://coveralls.io/repos/github/karlisup/chewingum/badge.svg?branch=master)](https://coveralls.io/github/karlisup/chewingum?branch=master)

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
      root: '/',
      src: 'src/components/',
      dest: 'dest/components/'
    },
    extensions: {
      template: '.twig'
    }
  })
  done()
})
```

## Options
### opts.location.src
Type: `String` Default: `src/components/`

Sets target for folder from which all the components will be taken.


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


