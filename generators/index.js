/**
 * generators/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');

const module = require('./module');
const route = require('./route');
const model = require('./model');
const version = require('./version');

module.exports = (plop) => {
    plop.addPrompt('recursive', require('inquirer-recursive'));
    plop.setGenerator('module', module);
    plop.setGenerator('route', route);
    plop.setGenerator('model', model);
    plop.setGenerator('version', version);
};
