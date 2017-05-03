/* globals describe, it */
'use strict'

var chai = require('chai')
var expect = chai.expect

var processTemplate = require('../lib/compolib.processTemplate.js')
var getOptions = require('../lib/compolib.getOptions')
var opts = getOptions()

// processTemplate(opts, component, files.data)


describe('compolib.processTemplate', function () {
  it('should return that styleguide location by default is located in package folder', function () {
    expect(
      opts.location.styleguide === path.normalize('node_modules/chewingum/doc-template/') 
    ).to.be.true
  })
})
