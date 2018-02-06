'use strict'

var path = require('path')

function GenerateSearch (opts) {
  this._opts = opts
}

/**
 * Extracts name, firstUrl part and Url from components to generate search. The
 * first part of url is being used TODO: ?
 * @returns {Array}
 */
GenerateSearch.prototype.getItems = function () {
  var searchableItems = []
  for (var i = 0, l = this._opts.components.length; i < l; i++) {
    var component = this._opts.components[i]
    var url = path.join(component.destUrlDir, component.name + '.html')
    var absoluteUrl = path.normalize('/' + url)
    var firstUrlPart = absoluteUrl.split('/', 1)[0]
    var item = [component.name, firstUrlPart, absoluteUrl]
    searchableItems.push(item)
  }
  return searchableItems
}

module.exports = GenerateSearch