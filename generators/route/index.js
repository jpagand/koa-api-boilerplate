/**
 * Route Generator
 */
const fs = require('fs')
const moduleExists = require('../utils/moduleExists')
const versionExists = require('../utils/versionExists')
const toDashCase = require('../utils/dashCase')
const insertInFile = require('../utils/insertInFile')
const directories = require('../utils/directories')

function trimTemplateFile (template) {
    // Loads the template file and trims the whitespace and then returns the content as a string.
  return fs.readFileSync(`generators/route/${template}`, 'utf8')
}

function isValidMethod (value) {
  return value === 'GET' || value === 'POST' || value === 'PATH' || value === 'DELETE' || value === 'PUT'
}

let version = 'v1'

const routePrompts = [
  {
    type: 'input',
    name: 'path',
    message: 'Enter the path of the route. (module name will be the base url)',
    default: '/',
    validate: (value) => {
      if ((/\/.*/).test(value)) {
        return true
      }
      return 'invalide path : (/profile/:id or /test)'
    },
  }, {
    type: 'input',
    name: 'method',
    message: 'Enter the method (POST, GET, PATCH, DELETE, PUT)',
    default: 'GET',
    validate: (value) => {
      if ((/.+/).test(value) && isValidMethod(value)) {
        return true
      }

      return 'invalid method'
    },
  }, {
    type: 'input',
    name: 'handler',
    message: 'Enter the handler name',
    default: 'test',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return true
      }

      return 'hanlder is required'
    },
  }, {
    type: 'confirm',
    name: 'secureRoute',
    default: false,
    message: 'Does it is secured?',
  }, {
    type: 'confirm',
    name: 'validateRoute',
    default: false,
    message: 'Does it need parameter validation?',
  },
]

const prompts = [
  {
    type: 'list',
    name: 'version',
    message: 'Choose the version',
    choices: () => { return directories.getVersionList() },
    validate: (value) => {
      if ((/v[0-9]+/).test(value) && versionExists(value)) {
        version = value
        return true
      }

      return 'This version name doesn\'t exists'
    },
  }, {
    type: 'list',
    name: 'module',
    message: 'Which module the route is for?',
    choices: (answers) => { return directories.getModuleList(answers.version) },
    validate: (value) => {
      if ((/.+/).test(value)) {
        return moduleExists(value, version)
                    ? true
                    : `"${value}" doesn't exist.`
      }

      return 'The module is required'
    },
  },
  ...routePrompts,
]

const actions = (data) => {
  data.version = toDashCase(data.version).toLowerCase()
  data.apiVersion = data.version.replace('v', '')
  const moduleName = toDashCase(data.module).toLowerCase()
  data.moduleName = moduleName

  if (data.path !== '') {
    data.url = `/${data.version}/${moduleName}${data.path}`
  } else {
    data.url = `/${data.version}/${moduleName}`
  }
  const actions = []
  actions.push(insertInFile.insertRoute(`/src/modules/${data.version}/${moduleName}/router.js`, trimTemplateFile('router.js.hbs')))
  actions.push(insertInFile.insertContent(`/src/modules/${data.version}/${moduleName}/controller.js`, trimTemplateFile('handler.js.hbs')))
  actions.push(insertInFile.insertExport(`/src/modules/${data.version}/${moduleName}/controller.js`, `{{ camelCase handler }},`))
  actions.push(insertInFile.insertContent(`/test/${data.version}/${moduleName}.spec.js`, trimTemplateFile('test.js.hbs')))

  if (data.validateRoute) {
    actions.push(insertInFile.insertContent(`/src/modules/${data.version}/${moduleName}/validators.js`, trimTemplateFile('validator.js.hbs')))
    actions.push(insertInFile.insertExport(`/src/modules/${data.version}/${moduleName}/validators.js`, `{{ camelCase handler }},`))
  }
  return actions
}

module.exports = {
  description: 'Add a route',
  prompts,
  actions,
  routePrompts,
}
