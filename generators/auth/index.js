/**
* Route Generator
*/
const fs = require('fs')
const modelExists = require('../utils/modelExists')
const insertInFile = require('../utils/insertInFile')

const strategies = ['local', 'facebook', 'google', 'twitter']

const getAvailableStrategies = () => {
  try {
    const usedStrategies = fs.readdirSync('src/auth')
    return strategies.filter(strat => {
      return usedStrategies.indexOf(strat) === -1
    })
  } catch (e) {
    return strategies
  }
}
const getUserActions = () => {
  return [
    {
      type: 'add',
      path: process.cwd() + '/src/models/users.js',
      templateFile: './auth/user/model.js.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: process.cwd() + '/src/modules/v1/users/router.js',
      templateFile: './auth/user/router.js.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: process.cwd() + '/src/modules/v1/users/controller.js',
      templateFile: './auth/user/controller.js.hbs',
      abortOnFail: true,
    },
    {
      type: 'add',
      path: process.cwd() + '/src/modules/v1/users/validators.js',
      templateFile: './auth/user/validators.js.hbs',
      abortOnFail: true,
    },

  ]
}

const getStrategyAction = (strategy) => {
  const importTemplate = `import ${strategy} from './${strategy}'`
  const routeTemplate = `router.use('/auth/${strategy}', ${strategy}.routes(), ${strategy}.allowedMethods())`
  const passportTemplate = `require('./${strategy}/passport').setup(User, config)`

  const actions = [{
    type: 'add',
    path: process.cwd() + `/src/auth/${strategy}/index.js`,
    templateFile: `./auth/${strategy}/index.js.hbs`,
    abortOnFail: true,
  },
  {
    type: 'add',
    path: process.cwd() + `/src/auth/${strategy}/passport.js`,
    templateFile: `./auth/${strategy}/passport.js.hbs`,
    abortOnFail: true,
  },
  ]
  actions.push(insertInFile.insertImport('/src/auth/index.js', importTemplate))
  actions.push(insertInFile.insertRoute('/src/auth/index.js', routeTemplate))
  actions.push(insertInFile.insertContent('/src/auth/index.js', passportTemplate))

  if (strategy === 'twitter') {
    const sessionImport = `import session from 'koa-generic-session'
      import MongoStore from 'koa-generic-session-mongo'`

    const sessionContent = `api.keys = ['your-session-secret', 'another-session-secret']
        api.use(convert(session({
            store: new MongoStore(),
        })))`
    actions.push(insertInFile.insertImport('/src/api.js', sessionImport))
    actions.push(insertInFile.insertContent('/src/api.js', sessionContent))
  }
  return actions
}
const getStrategiesActions = (strategies) => {
  let actions = []
  strategies.forEach(strategy => {
    actions = [...actions, ...getStrategyAction(strategy)]
  })
  return actions
}

module.exports = {
  description: 'Add an authentication strategy',
  prompts: [
    {
      type: 'checkbox',
      name: 'strategies',
      message: 'Which authentication strategies would you like to include?',
      choices: getAvailableStrategies(),
    },
  ],

  // Add the route to the routes.js file above the error route
  actions: (data) => {
    let actions = []
    if (!modelExists('users')) {
          // means first time auth generator is called
      actions = [...actions, ...getUserActions()]
      actions.push({
        type: 'add',
        path: process.cwd() + '/src/auth/index.js',
        templateFile: './auth/index.js.hbs',
        abortOnFail: true,
      })
      actions.push({
        type: 'add',
        path: process.cwd() + '/src/auth/middlewares.js',
        templateFile: './auth/middlewares.js.hbs',
        abortOnFail: true,
      })
      const authImport = 'import auth from \'../auth\''
      const usersImport = 'import users from \'./v1/users/router\''

      const authRoutes = 'api.use(auth.routes())'
      const usersRoutes = 'api.use(users.routes())'

      actions.push(insertInFile.insertImport('/src/modules/index.js', authImport))
      actions.push(insertInFile.insertImport('/src/modules/index.js', usersImport))
      actions.push(insertInFile.insertRoute('/src/modules/index.js', authRoutes))
      actions.push(insertInFile.insertRoute('/src/modules/index.js', usersRoutes))
    }
    actions = [...actions, ...getStrategiesActions(data.strategies)]

    return actions
  },
}
