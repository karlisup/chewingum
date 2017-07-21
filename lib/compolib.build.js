'use strict'

var path = require('path')
var console = require('better-console')
// var renderNav = require('./compolib.renderNav')
var CountComponents = require('./CountComponents')
// var components = require('./compolib.components')
var Components = require('./compolib.components').Components
var components = new Components()
var RenderPage = require('./RenderPage').RenderPage

var ncp = require('ncp').ncp

module.exports = function build (opts) {
  // copy assets to public folder
  ncp(opts.location.styleguide + '/assets', opts.location.dest + '/assets', function (err) {
    if (err) {
      return console.error(err)
    }
  })
  opts.components = [] // before build, reset components
  var countComponents = new CountComponents(opts)
  countComponents.init()

  // create simple list of components
  // Saves data in opts.searchableItems
  components.generateSearch(opts)

  // render all components
  // - ( component.html & raw.component.html ) + navigation
  // - enrich components array with new data (style, info, data file locations)
  // Saves data in opts.components
  components.renderAll(opts)

  var landingPage = {
    config: {
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'dashboard.twig'
    },
    data: {
      'root': opts.location.root,
      'searchableItems': opts.searchableItems,
      'filterItems': opts.filterItems
    },
    dest: path.join(opts.location.dest, 'index.html')
  }
  var renderPage = new RenderPage()
  renderPage.render(landingPage.config, landingPage.data, landingPage.dest)

  // console.log(util.inspect(opts.searchableItems, {showHidden: false, depth: null}))

  console.log('[CL] ' + opts.components.length + ' components rendered (' + opts.location.src + ')')
}
