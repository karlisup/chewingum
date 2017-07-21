/*global opts*/

var console = require('better-console')
var fs = require('graceful-fs')
var path = require('path')
var marked = require('marked')
var Twig = require('twig')
var twig = Twig.twig
var processTemplate = require('./compolib.processTemplate.js')
var hljs = require('./vendor/highlight')
var helpers = require('./compolib.helpers')
var url = require('url')
var RenderPage = require('./RenderPage.js').RenderPage
var GetDataFromJSON = require('./GetDataFromJSON').GetDataFromJSON

// prevent Twig from caching .html
Twig.cache(false)

function Components () {
  // this._foo = foo
}

Components.prototype.renderAll = function (opts) {
  for (var key in opts.components) {
    if (opts.components.hasOwnProperty(key)) {
      this.renderOne(opts, opts.components[key])
    }
  }
}

Components.prototype.renderOne = function (opts, component) {
  var files = loadFiles(opts, component)
  prepareContent.call(this, files, opts, component) // prepare metadata
  createPatternDemoPage.call(this, opts, component)
  createPatternDocPage.call(this, opts, component)
}

/* function loadFiles (opts, component) {
  // -------------------------------------
  //  Load files
  // -------------------------------------
  var files = {} // data, info, markup, style, js

  // load data from .json
  if (component.data !== '') {
    var jsonPath = path.join(opts.location.src, component.data)
    // recursive open .json files and return
    // full json string withour data@ references
    var getDataFromJSON = new GetDataFromJSON(opts)
    var data = getDataFromJSON.fetchData(jsonPath)
    if (data) {
      try {
        files.data = JSON.parse(data, 'utf8')
      } catch (err) {
        console.error(err.message + ' > In: ' + jsonPath)
      }
    } else {
      console.warn(data + 'WorkAround: setting files.data to empty string')
      files.data = ''
    }
  }

  // load description from .markdown
  if (component.info && component.info.path !== undefined) {
    try {
      files.info = fs.readFileSync(
        path.join(opts.location.src, component.info.path), 'utf8')
    } catch (e) {
      helpers.dumpError(e)
    }
  }

  // load markup from template ( .twig / .jade / .moustache / ...)
  if (component.tmpl && component.tmpl.path !== '') {
    try {
      files.markup = fs.readFileSync(
        path.join(opts.location.src, component.tmpl.path), 'utf8')
    } catch (e) {
      helpers.dumpError(e)
    }
  }

  // load demo
  if (component.demo) {
    try {
      files.demo = fs.readFileSync(
        path.join(opts.location.src, component.demo), 'utf8')
    } catch (e) {
      helpers.dumpError(e)
    }
  }

  // load style from stylesheet (.css, .less, .sass, .stylus)
  if (component.style !== '') {
    try {
      files.style = fs.readFileSync(
        path.join(opts.location.src, component.style), 'utf8')
    } catch (e) {
      helpers.dumpError(e)
    }
  }

  // load javasscript from .js
  if (component.js !== '') {
    try {
      files.js = fs.readFileSync(path.join(opts.location.src, component.js),
        'utf8')
    } catch (e) {
      helpers.dumpError(e)
    }
  }

  return files
} */

// type/id
// path to file
// Label
// templates could be more.
function loadFiles (opts, component) {
  var ComponentFiles = [
    {
      "type": "template",
      "name": "Template",
      "path": path.join(opts.location.src, component.tmpl.path)
    },
    {
      "type": "demo",
      "name": "Demo",
      "path": path.join(opts.location.src, component.demo)
    },
    {
      "type": "info",
      "name": "Information",
      "path": path.join(opts.location.src, component.info.path)
    },
    {
      "type": "javascript",
      "name": "JavaScript",
      "path": path.join(opts.location.src, component.js)
    },
    {
      "type": "style",
      "name": "Style",
      "path": path.join(opts.location.src, component.style)
    }
  ]

  for (var file in ComponentFiles) {
    if (!ComponentFiles.hasOwnProperty(file)) {
      continue;
    }
    fileContent = fs.readFileSync(file.path, 'utf8')
    //returnFileContent(file.path)
  }
}

function prepareContent (files, opts, component) {
  // compile Markdown to HTML
  if (files.info !== undefined) {
    component.info.compiled = marked(files.info)
  }
  // highlight data, info, markup, style, js
  // console.log(files.demo)
  if (files.demo !== undefined) component.code.push(
    highlightFileContent('demo', 'Demo', files.demo))
  if (files.markup !== undefined) component.code.push(
    highlightFileContent('tmpl', 'Markup', files.markup))
  if (files.style !== undefined) component.code.push(
    highlightFileContent('style', 'Style', files.style))
  if (files.js !== undefined) component.code.push(
    highlightFileContent('js', 'Javascript', files.js))
  if (files.data !== undefined) component.code.push(
    highlightFileContent('data', 'JSON',
      JSON.stringify(files.data, null, '\t')))

  // render component itself (e.g. navigation.twig + navigation.json)
  component.tmpl.compiled = processTemplate(opts, component, files.data)
  console.log('2', component.tmpl.compiled)
}

function highlightFileContent (id, title, content) {
  var item = {}
  item.id = id
  item.title = title
  item.content = hljs.highlightAuto(content.toString()).value
  item.content = '<pre><code>' + item.content + '</code></pre>'
  return item
}


function createPatternDemoPage (opts, component) {
  var demoPage = {
    config: {
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'layout--raw.twig'
    },
    data: {
      'root': opts.location.root,
      'title': component.name,
      'content': component.tmpl.compiled
    },
    dest: path.join(component.path, 'raw.' + component.name + opts.extensions.output)
  }
  var renderPage = new RenderPage()
  renderPage.render(demoPage.config, demoPage.data, demoPage.dest)
}

function createPatternDocPage (opts, component) {
  var demoPageUrl = path.join(component.path, 'raw.' + component.name + opts.extensions.output)
  var docPage = {
    config: {
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'component.twig'
    },
    data: {
      'root': opts.location.root,
      'searchableItems': opts.searchableItems,
      'filterItems': opts.filterItems,
      'compInfo': component.info.compiled,
      'tmplUrl': component.tmpl.path,
      'compCompiled': component.tmpl.compiled,
      'compCode': component.code,
      'compRawUrl': url.resolve(opts.location.root, demoPageUrl)
    },
    dest: path.join(component.path, component.name + opts.extensions.output)
  }
  var renderPage = new RenderPage()
  renderPage.render(docPage.config, docPage.data, docPage.dest)
}


Components.prototype.generateSearch = function (opts) {
  for (var key in opts.components) {
    if (opts.components.hasOwnProperty(key)) {
      var component = opts.components[key]
      var demoPath = path.normalize(path.join('/' + component.path,
        component.name + opts.extensions.output))
      var item = [component.name, component.path.split('/', 1)[0], demoPath]
      opts.searchableItems.push(item)
    }
  }
}

exports.Components = Components
