// TODO: Make options linear.
// Would make configuration more user friendly.
'use strict'

var path = require('path')
var packageName = 'chewingum'

module.exports = function (options) {
  function n (pathString) {
    return path.normalize(pathString)
  }

  var opts = options || {}

  opts.location = (opts.location) ? opts.location : {}
  opts.extensions = (opts.extensions) ? opts.extensions : {}

  opts.location.root = n(opts.location.root || '/')
  opts.location.src = n(opts.location.src || 'src/components/')
  opts.location.dest = n(opts.location.dest || 'dest/components/')
  opts.location.styleguide = n(opts.location.styleguide || 'node_modules/' + packageName + '/doc-template/')

  opts.extensions.template = opts.extensions.template || '.twig'
  opts.extensions.output = opts.extensions.output || '.html'



  return opts
}
