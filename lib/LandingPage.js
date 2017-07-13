var path = require('path')
var helpers = require('./compolib.helpers')
var Twig = require('twig')
var twig = Twig.twig
Twig.cache(false)

function LandingPage (opts) {
  this._opts = opts
}

LandingPage.prototype.render = function () {
  var dashboardHTML = renderHTML()
  saveToFile(dashboardHTML)
}

function renderHTML () {
  return twig({
    base: this._opts.location.styleguide,
    path: this._opts.location.styleguide + 'dashboard.twig',
    async: false
  }).render({
    'root': this._opts.location.root,
    'searchableItems': this._opts.searchableItems,
    'filterItems': this._opts.filterItems
  })
}

function saveToFile (fileContent) {
  var location = path.join(this._opts.location.dest, 'index.html')
  helpers.writeFile(location, fileContent)
}

exports.LandingPage = LandingPage
