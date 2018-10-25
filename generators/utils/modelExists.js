/**
* models exists
*
* Check whether the given model exist in the models directory
*/

const fs = require('fs')
const models = fs.readdirSync('src/models')

function modelExists (model) {
    return models.indexOf(model + '.js') >= 0
}

module.exports = modelExists
