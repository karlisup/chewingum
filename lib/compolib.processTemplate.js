'use strict'
// template engine consolidation library
var cons = require('consolidate')
// TODO Templating engine library should be loaded dynamically.
// Maybe it should be installed by user and passed as an object (as in Fractal)
var mustache = require('mustache') // but for now

// General dependencies
// var path = require('path')

// Twig
var Twig = require('twig')
var twig = Twig.twig
Twig.cache(false)

// TooklitTemplate2
//var tt2 = require('tt2')
//var Template = tt2.Template

module.exports = function (opts, component, data) {
  if (!component.tmpl.path) throw new Error('processTemplate: template path is not available')
  var passedData = (data !== undefined) ? data : ''

  if (opts.extensions.template === '.twig') { // Twig
    processTwig()
  } else if (
    opts.extensions.template === '.nunjucks' ||
    opts.extensions.template === '.mustache'
  ){
    processConsolidate()
    console.log('0',component.tmpl.compiled);
  }
  /* else if (opts.extensions.template === '.tt') { // tt2
    processTt2()
  }*/
  else {
    throw new Error('processTemplate.js: you cannot process template with extension ' + opts.extensions.template)
  }

  /**
   * process Twig template
   * result is saved in component.tmpl.compiled
   * original site:
   * js version: https://github.com/davidfoliveira/node-tt2
   */
  function processTwig () {
    return twig({
      //component.tmpl.compiled = twig({
      base: opts.location.src,
      path: opts.location.src + ((component.demo) ? component.demo : component.tmpl.path) ,
      async: false
    }).render(passedData)
  }


  function processConsolidate () {
    var templatingEngine = opts.extensions.template.substr(1); // take template engine name without dot
    console.log(' - - - - Consolidate - - - - ')
    cons[templatingEngine](opts.location.src + ((component.demo) ? component.demo : component.tmpl.path), passedData)
      .then(function (html) {
        console.log('1',html);
        return html;
        component.tmpl.compiled = html;
      })
      .catch(function (err) {
        throw err;
      });
  }
  /**
   * process Template Toolkit2 template
   * result is saved in component.tmpl.compiled
   * original site:
   * js version: https://github.com/davidfoliveira/node-tt2
   */
    /*function processTt2 () {
    var t = new Template({INCLUDE_PATH: opts.location.src})
    t.process(opts.location.src + component.tmpl.path, { data: passedData }, function (err, output) { // TODO: error if just passedData passed
      if (err) console.warn(err)
      component.tmpl.compiled = output
    })
  }*/
}
