/**
* Route Generator
*/
const modelExists = require('../utils/modelExists')
const versionExists = require('../utils/versionExists')
const toDashCase = require('../utils/dashCase')
const toCamelCase = require('../utils/camelCase')
const insertInFile = require('../utils/insertInFile')
const directories = require('../utils/directories')

const paramPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the parameter name?',
  },
  {
    type: 'list',
    name: 'type',
    message: 'What is the parameter type?',
    choices: [
      'String',
      'Number',
      'Date',
      'Boolean',
      'ObjectId',
      'Array',
    ],
  },
  {
    type: 'confirm',
    name: 'required',
    default: false,
    message: 'is it required?',
  },
  {
    type: 'confirm',
    name: 'unique',
    default: false,
    message: 'is it unique?',
  },
]

let version = 'v1'
module.exports = {
  description: 'Add a mongo model',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the model name? (user, upload...)',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return !modelExists(value)
        }
        return 'Name is required'
      },
    }, {
      type: 'confirm',
      name: 'timestamps',
      message: 'What to add creation and update date?',
      default: true,
    }, {
      type: 'confirm',
      name: 'CRUD',
      message: 'Do you want a CRUD?',
      default: true,
    }, {
      type: 'list',
      name: 'version',
      message: 'Choose the version',
      choices: () => { return directories.getVersionList() },
      when: function (answers) {
        return answers.CRUD
      },
      validate: (value) => {
        if ((/v[0-9]+/).test(value) && versionExists(value)) {
          version = value
          return true
        }
        return 'This version name doesn\'t exists'
      },
    }, {
      message: 'Do you want to add a field to the model?',
      type: 'recursive',
      name: 'fields',
      prompts: paramPrompts,
    },
  ],

  // Add the route to the routes.js file above the error route
  actions: (data) => {
    data.version = toDashCase(version).toLowerCase()
    const moduleName = toDashCase(data.name).toLowerCase()
    data.moduleName = moduleName
    data.url = `/${data.version}/${moduleName}s`

    let CRUDActions = []
    if (data.CRUD) {
      CRUDActions = [
        {
          type: 'add',
          path: `${process.cwd()}/src/modules/${data.version}/${moduleName}s/router.js`,
          templateFile: './model/router.js.hbs',
          abortOnFail: true,
        }, {
          type: 'add',
          path: `${process.cwd()}/src/modules/${data.version}/${moduleName}s/controller.js`,
          templateFile: './model/controller.js.hbs',
          abortOnFail: true,
        }, {
          type: 'add',
          path: `${process.cwd()}/src/modules/${data.version}/${moduleName}s/validators.js`,
          templateFile: './model/validators.js.hbs',
          abortOnFail: true,
        }, {
          type: 'add',
          path: `${process.cwd()}/test/${data.version}/${moduleName}s.spec.js`,
          templateFile: './model/test.js.hbs',
          abortOnFail: true,
        },
      ]
      const moduleImport = `import ${toCamelCase(data.name)} from 'modules/${data.version}/${moduleName}s/router'`
      const moduleRoutes = `api.use(${toCamelCase(data.name)}.routes())`

      CRUDActions.push(insertInFile.insertImport('/src/modules/index.js', moduleImport))
      CRUDActions.push(insertInFile.insertRoute('/src/modules/index.js', moduleRoutes))
    }

    return [{
      type: 'add',
      path: process.cwd() + '/src/models/{{camelCase name}}s.js',
      templateFile: './model/model.js.hbs',
      abortOnFail: true,
    }, ...CRUDActions ]
  },
}
