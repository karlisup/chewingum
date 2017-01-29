/* globals describe, it */
'use strict'

var chai = require('chai')
var expect = chai.expect

var path = require('path')
var fs = require('fs')
var ncp = require('ncp').ncp
var getOptions = require('../lib/compolib.getOptions')
var opts = getOptions()


describe('compolib.build', function () {
  afterEach(function() {
    // runs after each test in this block
    // clean up the tmp folder.
    // TODO: use rimraf to rm folder.
  });

  // assets folder should exist (it is being copied later)
  it('should return that doc-template contains assets folder', function () {
    expect(
      fs.existsSync('./doc-template/assets')
    ).to.be.true;
  })

  it('should return that styleguide location by default is located in package folder', function () {
    expect(
      opts.location.styleguide === path.normalize('node_modules/chewingum/doc-template/') 
    ).to.be.true
  })
})
