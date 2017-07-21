var fs = require('graceful-fs')
var path = require('path')

function GetDataFromJSON (opts) {
  this._opts = opts
  this._dataRegex = /["']data@(.*)["']/g
  this._jsonContnets = ''
}

GetDataFromJSON.prototype.fetchData = function (jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    console.error(jsonPath + ' file does not exist!')
    return {}
  }

  this._jsonContents = fs.readFileSync(jsonPath, 'utf8')
  if (hasDataFileReference(this._jsonContents)) {
    var match = this._dataRegex.exec(this._jsonContents)
    replaceReferencesWithData(match)
  }
  return this._jsonContents
}

function hasDataFileReference (data) {
  return (data.indexOf('data@') !== -1)
}

function replaceReferencesWithData (match) {
  while (match != null) {
    var referencedFilename = match[1]
    var fileContents = this.fetchData(this._opts,
      path.join(this._opts.location.src, referencedFilename))
    fileContents = fileContents || 'undefined'
    this._jsonContnets = this._jsonContnets.replace(referencedFilename, fileContents)
    match = this._dataRegex.exec(this._jsonContnets)
  }
}

exports.GetDataFromJSON = GetDataFromJSON
