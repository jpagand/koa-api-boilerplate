/**
 * generators/index.js
 *
 * Exports the generators so plop knows them
 */

const moduleGen = require('./module')
const route = require('./route')
const model = require('./model')
const version = require('./version')

module.exports = (plop) => {
    plop.addPrompt('recursive', require('inquirer-recursive'))
    plop.addHelper('curly', (object, open) => (open ? '{' : '}'))

    plop.setGenerator('module', moduleGen)
    plop.setGenerator('route', route)
    plop.setGenerator('model', model)
    plop.setGenerator('version', version)
}
