var helpers = require('./compolib.helpers')
var Twig = require('twig')
var twig = Twig.twig
Twig.cache(false)

function RenderPage (opts) {
  //this._opts = opts
}

RenderPage.prototype.render = function (config, data, destPath) {
  var dashboardHTML = renderHTML(config, data)
  helpers.writeFile(destPath, dashboardHTML)
}

function renderHTML (config, data) {
  var defaultConfig = {
    async: false
  }
  return twig(Object.assign(defaultConfig, config)).render(data)
}

exports.RenderPage = RenderPage
