const fs = require('fs')
var path = require('path')

function getDirectories (basePath) {
  return fs
    .readdirSync(basePath)
    .filter(function (file) {
      var stats = fs.lstatSync(path.join(basePath, file))
      if (stats.isSymbolicLink()) {
        return false
      }
      var isDir = stats.isDirectory()
      var isNotDotFile = path.basename(file).indexOf('.') !== 0
      return isDir && isNotDotFile
    })
    .sort()
}

function getVersionList () {
  return getDirectories('src/modules')
}

function getModuleList (version) {
  return getDirectories('src/modules/' + version)
}

module.exports = {
  getDirectories,
  getVersionList,
  getModuleList,
}
