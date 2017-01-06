/**
 * Route Generator
 */
const fs = require('fs');
const moduleExists = require('../utils/moduleExists');
const versionExists = require('../utils/versionExists');
const toCamelCase = require('../utils/camelCase');

function trimTemplateFile(template) {
    // Loads the template file and trims the whitespace and then returns the content as a string.
    return fs.readFileSync(`generators/route/${template}`, 'utf8');
}

function isValidMethod(value) {
    return value === 'GET' || value === 'POST' || value === 'PATH' || value === 'DELETE' || value === 'PUT';
}

const prompts = [
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
        message: 'Which module the route is for?',
        default: 'users',
        validate: (value) => {
            if ((/.+/).test(value)) {
                return moduleExists(value)
                    ? true
                    : `"${value}" doesn't exist.`;
            }

            return 'The module is required';
        }
    }, {
        type: 'input',
        name: 'path',
        message: 'Enter the path of the route. (module name will be the base url)',
        default: '',
        validate: (value) => {
            if ((/\/.+/).test(value)) {
                return 'invalide path : (profile/:id or test)';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'method',
        message: 'Enter the method (POST, GET, PATCH, DELETE, PUT)',
        default: 'GET',
        validate: (value) => {
            if ((/.+/).test(value) && isValidMethod(value)) {
                return true;
            }

            return 'invalid method';
        }
    }, {
        type: 'input',
        name: 'handler',
        message: 'Enter the handler name',
        default: 'profile',
        validate: (value) => {
            if ((/.+/).test(value)) {
                return true;
            }

            return 'hanlder is required';
        }
    }, {
        type: 'confirm',
        name: 'secureRoute',
        default: false,
        message: 'Does it is secured?'
    }, {
        type: 'confirm',
        name: 'validateRoute',
        default: false,
        message: 'Does it need parameter validation?'
    }
];

const actions =  (data) => {
    if (data.path !== '') {
        data.url = `/${dashCase version}/${toCamelCase(data.module)}/${data.path}`;
    } else {
        data.url = `/${dashCase version}/${toCamelCase(data.module)}`;
    }
    return [
        {
            type: 'modify',
            path: process.cwd() + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/router.js',
            pattern: /(const\sroutes\s=\s\[)\n*\s*/g,
            template: trimTemplateFile('router.js.hbs')
        }, {
            type: 'modify',
            path:  process.cwd() + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/controller.js',
            pattern: /(\sexport\s{)/g,
            template: trimTemplateFile('handler.js.hbs')
        }, {
            type: 'modify',
            path:  process.cwd() + '/src/modules/{{lowercase dashCase version}}/{{lowercase dashCase module}}/validators.js',
            pattern: /(\sexport\s{)/g,
            template: trimTemplateFile('validator.js.hbs')
        }, {
            type: 'modify',
            path:  process.cwd() + '/test/{{lowercase dashCase version}}/{{lowercase dashCase module}}.spec.js',
            pattern: /(}\)[\s\n]*$(?![\r\n]))/g, // }) EOF
            template: trimTemplateFile('test.js.hbs')
        }
    ];
}

module.exports = {
    description: 'Add a route',
    prompts ,
    actions
};