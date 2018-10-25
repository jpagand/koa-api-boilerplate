/**
 * version Generator
 */

const versionExists = require('../utils/versionExists')
const fs = require('fs')
const path = require('path')

module.exports = {
  description: 'Add a version to the api',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'v2',
      validate: (value) => {
        if ((/v[0-9]+/).test(value)) {
          return versionExists(value)
                        ? 'this version number already exists'
                        : true
        }
        return 'Wrong version name'
      },
    },
  ],
  actions: (data) => {
    return [
      () => {
        fs.mkdirSync(path.resolve(process.cwd(), 'src/modules', `${data.name}`))
        return Promise.resolve(`Version ${data.name} successfully created !`)
      },
    ]
  },
}
