/**
 * Route Generator
 */
const fs = require('fs');
const modelExists = require('../utils/modelExists');

module.exports = {
    description: 'Add a mongo model',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'What is the model name?',
        validate: (value) => {
            if ((/.+/).test(value)) {
                return !modelExists(value);
            }

            return 'Name is required';
        },
  }],

    // Add the route to the routes.js file above the error route
    actions: (data) => {
        return [{
            type: 'add',
            path: process.cwd()  + '/src/models/{{camelCase name}}.js',
            templateFile: './model/model.js.hbs',
            abortOnFail: true,
          }];
    },
};
