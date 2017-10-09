var path = require('path')

function ProcessJSON (opts) {
  this._opts = opts
  this._dataRegex = /["']data@(.*)["']/g
  this._jsonContnets = ''
}

ProcessJSON.prototype.findDataReference = function (json) {
  if (hasDataFileReference(json)) {
    var match = this._dataRegex.exec(json)
    replaceReferencesWithData(match)
  }
  return json
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

exports.ProcessJSON = ProcessJSON
