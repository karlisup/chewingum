'use strict'

var fs = require('graceful-fs')
var path = require('path')

/**
 * Creating new component
 * @param opts
 * @param component
 */
function Component (opts, component, possibleExtensions) {
  this._opts = opts
  this._component = component

  this._component.files = []
  this._component.code = [] // array of file markups

  // component related files
  /*this._component.tmpl = [] // ->path & DEPRECATED: compiled
  this._component.info = '' // ->path & DEPRECATED: compiled
  this._component.data = '' // .json
  this._component.style = '' // .sass (and others)
  this._component.js = '' // .js*/
}

/**
 * Find other parts of component (data, info, etc.)
 */
Component.prototype.assemble = function assemble () {
  walkFolderFiles.call(this, this._component.fullPath)
}

function walkFolderFiles(folder) {
  fs.readdirSync(folder).filter(function (file) {
    var extension = path.extname(file).toLowerCase() || ''
    var fileName = file.substr(0, file.indexOf('.'))

    // only files with the same name as template or '_' in front
    if (fileName === this._component.name || '_' + this._component.name) {
      // Add demo file to component if it exists.
      if ( RegExp('.*\.demo\..*').test(file)) {
        addFile.call(this, 'demo', file)
        return
      }

      switch (extension) {
        case '.json':
          addFile.call(this, 'data', file)
          break
        case '.md':
          addFile.call(this, 'info', file)
          break
        case '.js':
          addFile.call(this, 'js', file)
          break
        case '.scss':
          addFile.call(this, 'style', file)
          break
      }
      // if extension is among supported templating engines
      if (this._opts.templateExtensions.indexOf(extension) !== -1) {
        addFile.call(this, 'tmpl', file)
      }
    }
  }.bind(this))
}

function addFile (type, filename) {
  var fileFullPath = path.join(this._component.fullPath, filename)
  if (type === 'tmpl') {
    this._component.tmpl.push(fileFullPath)
  }
  this._component[type] = fileFullPath
}

// if (filePath) {
//   // if component is in root folder it's location becomes undefined
//   var url = path.dirname(filePath).split(opts.location.src)[1] // path -> url
//   this.path = (url === undefined) ? '/' : url
//   this.name = path.basename(filePath, opts.extensions.template) // foo/bar/baz/asdf/quux.html ==> quux
//   this.tmpl.path = path.join(this.path, this.name + opts.extensions.template)
// }



module.exports = Component
