const insertInFile = exports.insertInFile = function (path, pattern, template) {
  return {
    type: 'modify',
    path: process.cwd() + path,
    pattern: pattern,
    template: template,
    abortOnFail: true,
  }
}

exports.insertImport = function insertImport (path, template) {
  const pattern = /(\/\*\* GENERATED IMPORTS\. DO NOT TOUCH \*\*\/)/
  const tmpl = `$1\r\n${template}`
  return insertInFile(path, pattern, tmpl)
}
exports.insertExport = function insertExport (path, template) {
  const pattern = /(\/\*\* GENERATED EXPORT\. DO NOT TOUCH \*\*\/)/
  const tmpl = `$1\r\n${template}`
  return insertInFile(path, pattern, tmpl)
}

exports.insertRoute = function insertRoute (path, template) {
  const pattern = /(\/\*\* GENERATED ROUTES\. DO NOT TOUCH \*\*\/)/
  const tmpl = `$1\r\n${template}`
  return insertInFile(path, pattern, tmpl)
}

exports.insertContent = function insertContent (path, template) {
  const pattern = /(\/\*\* GENERATED CONTENT\. DO NOT TOUCH \*\*\/)/
  const tmpl = `$1\r\n${template}`
  return insertInFile(path, pattern, tmpl)
}
