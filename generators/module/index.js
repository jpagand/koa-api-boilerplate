/**
 * Apimodule Generator
 */

const moduleExists = require('../utils/moduleExists');
const versionExists = require('../utils/versionExists');
const toCamelCase = require('../utils/camelCase');

const routeActions = require('../route').actions;
const routePrompts = require('../route').prompts;

module.exports = {
    description: 'Add a module to the api',
    prompts: [
        {
           type: 'input',
           name: 'version',
           message: 'Enter the version',
           default: 'v1',
           validate: (value) => {
               if ((/v.+/).test(value) && versionExists(value)) {
                   return true;
               }

               return 'This version name doesn\'t exists';
           }
       }, {
            type: 'input',
            name: 'module',
            message: 'What should it be called?',
            default: 'test',
            validate: (value) => {
                if ((/.+/).test(value)) {
                    return moduleExists(value)
                        ? 'A component or container with this name already exists'
                        : true;
                }

                return 'The name is required';
            }
        }, {
            type: 'confirm',
            name: 'wantPrivate',
            default: false,
            message: 'Do you want some private routes?'
        }, {
            type: 'confirm',
            name: 'wantValidators',
            default: false,
            message: 'Do you want parameters validation for some routes?'
        }, {
            type: 'recursive',
            message: 'Do you want to add a ne route to the module?',
            name: 'routes',
            prompts: routePrompts
        }
    ],
    actions: (data) => {
        let actions = [
            {
                type: 'add',
                path: process.cwd()  + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/router.js',
                templateFile: './module/router.js.hbs',
                abortOnFail: true
            }, {
                type: 'add',
                path: process.cwd()  + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/controller.js',
                templateFile: './module/controller.js.hbs',
                abortOnFail: true
            }, {
                type: 'add',
                path: process.cwd()  + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/validators.js',
                templateFile: './module/validators.js.hbs',
                abortOnFail: true
            }, {
                type: 'add',
                path: process.cwd()  + '/test/{{lowercase dashCase version}}/{{lowercase dashCase module}}.spec.js',
                templateFile: './module/test.js.hbs',
                abortOnFail: true
            }
        ];


        if(data.routes) {
            data.routes.forEach((routeData) => {
                actions = actions.concat(routeActions(routeData));
            });
        }
        return actions;
    }
};
