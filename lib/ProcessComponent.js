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

function ProcessComponent (opts) {
  this._opts = opts
  // template & demo related
  this._info = '' // 1 Markdown file content
  this._data = '' // 1 Demo data file content
  this._templates = [] // Multiple template file contents
  this._demos = [] // Multiple demo (template) file contents
  this._processedTemplates = [] // Multiple processed files with data
  this._processedDemo = [] // Either template file or demo file
  this._demoUrl = '' // needed for fetching doc page iframe
  this._rawTemplLinks = [] // links that lead to raw template HTMLs
}

ProcessComponent.prototype.renderOne = function (component) {
  var that = this;
  processComponentFiles.call(this, component)
  processTemplateFiles.call(this, function () { // async template processing
    createRawPatternPages.call(that)
    createPatternDemoPage.call(that)
    createPatternDocPage.call(that, component)
  })
}

/**
 * [x] All files except Markdown should provide code example
 * [x] Markdown files has to be processed to HTML
 * [x] Processed Markdown has to be saved
 * [x] JSON files could contain @data reference.
 * [x] Processed JSON has to be saved
 * [x] Select demo and template files
 * @param component
 */
function processComponentFiles (component) {
  for (var i = 0, l = component.files.length; i < l; i++) {
    var file = component.files[i]

    // read file
    var fileContents = returnFileContents(file.srcPathDir)

    // format file content
    if (file.extension === '.json') {
      // JSON files could contain @data reference
      // fileContents = JSON.stringify(fileContents, null, '\t')
      var processJSON = new ProcessJSON(this._opts)
      fileContents = processJSON.findDataReference(fileContents)
      // Processed JSON has to be saved
      this._data = JSON.parse(fileContents)
    }
    if (file.extension !== '.md' && '.markdown') {
      // All files except Markdown should provide code example
      var formattedFileContent = highlightFileContent(file.id, file.title, fileContents)
      component.code.push(formattedFileContent)
    } else {
      // Markdown files has to be processed to HTML
      // Processed Markdown has to be saved
      this._info = marked(fileContents)
    }
    // Select demo and template files
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

function processTemplateFiles (callback) {
  var that = this;
  var processTemplate = new ProcessTemplate(this._opts)
  if (this._demos.length > 0) {
    var demo = this._demos[0]
    processTemplate.process(demo.srcPathDir, this._data, demo.id, function (html) {
      demo.html = html
      that._processedDemo.push(demo)
      callback()
    })
  }
  for (var i = 0, l = this._templates.length; i < l; i++) {
    var tmpl = this._templates[i]
    processTemplate.process(tmpl.srcPathDir, this._data, tmpl.id, function (html) {
      tmpl.html = html
      that._processedTemplates.push(tmpl)
      callback()
    })
  }
}

function highlightFileContent (id, title, content) {
  var item = {}
  item.id = id
  item.title = title
  item.content = hljs.highlightAuto(content.toString()).value
  item.content = '<pre><code>' + item.content + '</code></pre>'
  return item
}

function createRawPatternPages () {
  for (var i = 0, l = this._processedTemplates.length; i < l; i++) {
    var file = this._processedTemplates[i]
    this._rawTemplLinks.push(file.destUrl) // for passing later to doc
    createRawPatternPage.call(this, file)
  }
}

function createRawPatternPage (file) {
  var rawPage = {
    config: {
      base: this._opts.location.styleguide,
      path: this._opts.location.styleguide + 'layout--raw.twig'
    },
    data: {
      'root': this._opts.location.root,
      'title': file.name,
      'content': file.html
    },
    dest: file.destPath
  }
  var renderPage = new RenderPage()
  renderPage.render(rawPage.config, rawPage.data, rawPage.dest)
}

/**
 * if _processedDemo empty take one from _processedTemplates.
 */
function createPatternDemoPage () {
  if (this._processedDemo.length > 0) {
    var file = this._processedDemo
    this._demoUrl = file.destUrl // for later reference in Demo page.
    var demoPage = {
      config: {
        base: this._opts.location.styleguide,
        path: this._opts.location.styleguide + 'layout--raw.twig'
      },
      data: {
        'root': this._opts.location.root,
        'title': file.name,
        'content': file.html
      },
      dest: file.destPath
    }
    var renderPage = new RenderPage()
    renderPage.render(demoPage.config, demoPage.data, demoPage.dest)
  } else if (this._processedTemplates.length > 0) {
    this._demoUrl = this._processedTemplates[0].destUrl
  }
}

function createPatternDocPage (component) {
  var docPage = {
    config: {
      base: this._opts.location.styleguide,
      path: this._opts.location.styleguide + 'component.twig'
    },
    data: {
      'root': this._opts.location.root,
      'searchableItems': this._opts.searchableItems,
      'filterItems': this._opts.filterItems,
      'readme': this._info,
      'rawTemplLinks': this._rawTemplLinks,
      'iframeDemoUrl': url.resolve(this._opts.location.root, this._demoUrl),
      'codePreview': component.code
    },
    dest: path.join(component.destPathDir, component.name + '.html')
  }
  var renderPage = new RenderPage()
  renderPage.render(docPage.config, docPage.data, docPage.dest)
}


exports.Components = ProcessComponent
