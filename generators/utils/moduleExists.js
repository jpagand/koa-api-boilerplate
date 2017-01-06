/**
 * module exists
 *
 * Check whether the given module exist in the modules directory
 */

const fs = require('fs')

function moduleExists (mod, version) {
    const modules = fs.readdirSync(`src/modules/${version}`)
    return modules.indexOf(mod) >= 0
}

module.exports = moduleExists
