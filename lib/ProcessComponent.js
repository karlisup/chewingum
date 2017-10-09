/*global opts*/

var console = require('better-console')
var fs = require('graceful-fs')
var path = require('path')
var marked = require('marked')
var Twig = require('twig')
var twig = Twig.twig
var ProcessTemplate = require('./ProcessTemplate.js').ProcessTemplate
var hljs = require('./vendor/highlight')
var helpers = require('./compolib.helpers')
var url = require('url')
var RenderPage = require('./RenderPage.js').RenderPage
var ProcessJSON = require('./ProcessJSON').ProcessJSON

// prevent Twig from caching .html
Twig.cache(false)

function Components (opts) {
  this._opts = opts
  // template & demo related
  this._info = '' // 1 Markdown file content
  this._data = '' // 1 Demo data file content
  this._templates = [] // Multiple template file contents
  this._demos = [] // Multiple demo (template) file contents
  this._processedTemplates = [] // Multiple processed files with data
  this._processedDemo = '' // Either template file or demo file if provided
}

Components.prototype.renderAll = function () {
  for (var i = 0, l = this._opts.components.length; i < l; i++) {
    renderOne.call(this, this._opts.components[i])
  }
}

function renderOne (component) {
  processComponentFiles.call(this, component)

  var processTemplate = new ProcessTemplate(this._opts)
  if (this._demos.length > 0) {
    this._demos[0]
  }
  // take first demo and process it

  for (var i = 0, l = this._templates.length; i < l; i++) {
    // TODO TODO TODO paliku te
    // vai ir verts pushot ieksha tikai HTML? Varbut visu objektu?
    var html = processTemplate(3 parametri)
    this._processedTemplates.push(html)
  }


  // TODO - stulbs for loops (atkartoja mainīgie)
  for (var i = 0, l = this._demos.length; i < l; i++) {
    // TODO TODO TODO paliku te
    // vai ir verts pushot ieksha tikai HTML? Varbut visu objektu?
    var html = processTemplate(3 parametri)
    this._processedTemplates.push(html)
  }





  // process template
  // process demo (check how Davide done it in previous versions? )
  // make a documentation
  //

  // Demo and template files has to be processed
  createPatternDemoPage.call(this, component)
  createPatternDocPage.call(this, component)
}

/**
 * [x] All files except Markdown should provide code example
 * [x] Markdown files has to be processed to HTML
 * [x] Processed Markdown has to be saved
 * [x] JSON files could contain @data reference.
 * [x] Processed JSON has to be saved
 * [x] Demo and template files has to be processed
 * [x] Render a Demo file
 * [x] Render a Template file
 * [x] Render a Template documentation file
 *
 * @param component
 */
function processComponentFiles (component) {
  for (var i = 0, l = component.files.length; i < l; i++) {
    var file = component.files[i]

    // read file
    var fileContents = returnFileContents(file.fullPath)

    // format file content
    if (file.extension === '.json') {
      // JSON files could contain @data reference
      fileContents = JSON.stringify(fileContents, null, '\t')
      var processJSON = new ProcessJSON(this._opts)
      fileContents = processJSON.findDataReference(fileContents)
      // Processed JSON has to be saved
      file._data = fileContents
    }
    if (file.extension !== '.md' && '.markdown') {
      // All files except Markdown should provide code example
      var formattedFileContent = highlightFileContent(file.id, file.title, fileContents)
      component.code.push(formattedFileContent)
    } else {
      // Markdown files has to be processed to HTML
      // Processed Markdown has to be saved
      file._info = marked(fileContents)
    }
    //TODO: obsolete if files are being loaded from file
    if (this._opts.templateExtensions.indexOf(file.extension) > -1) {
      if (file.demo) {
        this._demos.push(file)
        continue
      }
      this._templates.push(file)
    }
  }
}

function returnFileContents (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File "' + filePath + ' not found!');
    } else {
      throw err
    }
  }
}

/*function prepareContent (files, opts, component) {
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
}*/

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

function createPatternDocPage (component) {
  var demoPageUrl = path.join(component.path, 'raw.' + component.name + this._opts.extensions.output)
  var docPage = {
    config: {
      base: this._opts.location.styleguide,
      path: this._opts.location.styleguide + 'component.twig'
    },
    data: {
      'root': this._opts.location.root,
      'searchableItems': this._opts.searchableItems,
      'filterItems': this._opts.filterItems,
      'compInfo': component.info.compiled,
      'tmplUrl': component.tmpl.path,
      'compCompiled': component.tmpl.compiled,
      'compCode': component.code,
      'compRawUrl': url.resolve(this._opts.location.root, demoPageUrl)
    },
    dest: path.join(component.path, component.name + this._opts.extensions.output)
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
