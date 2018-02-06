'use strict'

var fs = require('graceful-fs')
var path = require('path')

/**
 * Creating new component
 * @param opts
 * @param component
 */
function Component (opts, component) {
  this._opts = opts
  this._component = component
  this._component.files = []
  this._component.code = [] // array of file markups
}

/**
 * Find other parts of component (data, info, etc.)
 */
Component.prototype.assemble = function assemble () {
  walkFolderFiles.call(this, this._component.srcPathDir)
  this._opts.components.push(this._component)
}

function walkFolderFiles (folder) {
  fs.readdirSync(folder).filter(function (file) {
    var newFile = {}
    newFile.fullName = file
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
  file.srcPathDir = path.join(this._component.srcPathDir, file.fullName)
  file.isDemo = isDemo(file.name)
  if (this._opts.templateEngine.indexOf(file.id) !== -1) {
    file.destUrl = path.join(this._component.destUrlDir, file.fullName + '.html')
    file.destPath = path.join(this._component.destPathDir, file.fullName + '.html')
  }
  this._component.files.push(file)
}

// TODO: fails if a file name is demo (demo.mustache).
// TODO: adapt it so only demo.demo.mustache results in a true statement.
function isDemo (filename) {
  return RegExp('.*\.demo\..*').test(filename)
}

module.exports = Component
