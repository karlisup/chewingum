'use strict'

var fs = require('graceful-fs')
var path = require('path')
var Component = require('./compolib.Component')

function CountComponents (opts) {
  this._opts = opts
  this._possibleExtensions = getAllTemplateExtensions.call(this)
}

CountComponents.prototype.init = function () {
  recursivelyWalkFiletree.call(this, this._opts.location.src)
}

function recursivelyWalkFiletree (dir) {
  fs.readdirSync(dir).filter(function (file) {
    if (file.charAt(0) === '.') {
      return // ignore hidden files
    }
    if (/^.*\.demo\.[^.\n]+$/.test(file)) {
      return // ignore *.demo.* files
    }
    if (isFolder(file)) {
      var filePath = path.join(dir, file)
      recursivelyWalkFiletree.call(this, filePath)
    }
    if (!isSupportedTemplateFile.call(this, file)) {
      return
    }

    var component = {}
    component.name = file.substr(0, file.indexOf('.'))
    component.fullPath = dir // for fetching file
    component.patternPath = dir.split(this._opts.location.src)[1] // folder

    // there could be a situation when e.g. .twig template initializes component
    // creation. When you see another template file (e.g. mustache) you
    // shouldn't initialize it again.
    if (componentExists.call(this, file, component.patternPath)) {
      return
    }

    // if component !exist - create it.
    var newComponent = new Component(this._opts, component, this._possibleExtensions)
    newComponent.assemble()
  }.bind(this))
}

/**
 * Detect from filename if it's folder or a file.
 */
function isFolder (file) {
  return path.extname(file) === ''
}

/**
 * Look up a component with the same name and url
 * @param title
 * @param folder
 * @returns {boolean}
 */
function componentExists (title, folder) {
  for (var i = 0, l = this._opts.components.length; i < l; i++) {
    var component = this._opts.templateEngine[i]
    if (component.name === title && component.path === folder) {
      return true
    }
  }
  return false
}

/**
 * Returns if file extension is among the ones passed in gulpfile.js config.
 * @param file
 * @returns {boolean}
 */
function isSupportedTemplateFile (file) {
  var fileExtension = path.extname(file).toLowerCase()
  return this._possibleExtensions.indexOf(fileExtension) > -1
}

module.exports = CountComponents
