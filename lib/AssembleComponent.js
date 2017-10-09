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
  this._opts.components.push(this._component)
}

function walkFolderFiles (folder) {
  fs.readdirSync(folder).filter(function (file) {
    var newFile = {}
    newFile.extension = path.extname(file).toLowerCase() || ''
    newFile.name = file.substr(0, file.indexOf('.'))

    // only files with the same name as template or '_' in front
    if (newFile.name === this._component.name || '_' + this._component.name) {
      // if extension is among supported file extensions
      if (this._opts.fileExtensions.indexOf(newFile.extension) !== -1) {
        addFile.call(this, newFile)
      }
    }
  }.bind(this))
}

function addFile (newFile) {
  var file = newFile
  file.id = file.extension.substring(1) // get extension without a dot
  file.title = file.id // code tabs will be named after extension
  file.fullPath = path.join(this._component.fullPath, file.name + file.extension)
  // file.patternUrl = getPatternUrl(filename) // TODO: needed only for tmpl?
  file.isDemo = isDemo(file.name)
  this._component.files.push(file)
}

function isDemo (filename) {
  return RegExp('.*\.demo\..*').test(filename)
}

/**
 * Url that's relative to the
 * @param filename
 * @returns {*|string}
 */
/*function getPatternUrl (filename) {
  var url = path.dirname(filename).split(this._opts.location.src)[1] // path -> url
  return url || '/'
}*/
// if (filePath) {
//   // if component is in root folder it's location becomes undefined
//   var url = path.dirname(filePath).split(opts.location.src)[1] // path -> url
//   this.path = (url === undefined) ? '/' : url
//   this.name = path.basename(filePath, opts.extensions.template) // foo/bar/baz/asdf/quux.html ==> quux
//   this.tmpl.path = path.join(this.path, this.name + opts.extensions.template)
// }

module.exports = Component
