# koa-api-boilerplate
KoaJS api boilerplate with generators to easly handle versionning &amp; avoid boilerplate code


## Content
- [Language](#language-preprocessor)
- [Get started](#get-started)
    - [Installation](#installation)
    - [Commands](#commands)
- [What is inside](#what-is-inside)
- [List of generators](#list-of-generators)
- [Philosophy](#philosophy)
    - [Technologies](#technologies)
    - [Prerequisites](#prerequisites)
    - [Folder Hierarchy](#folder-hierarchy)
- [Team](#team)

## [Language & Preprocessor](#language-preprocessor)
* [ES6](http://es6-features.org)
* [Babel](https://babeljs.io/)

---

## [Get started](#get-started)

### [Installation](#installation)

1. Clone project
    ```
    git clone https://github.com/nathanloisel/koa-api-boilerplate [PATH/TO/YOUR/PROJECT_NAME]
    ```

2. Change project name
- [OSX](#osx)
    ```
    find . -type f -name '*.*' -exec sed -i '' s/koa-api-boilerplate/PROJECT_NAME/ {} +
    ```
- [LINUX](#linux)
    ```
    find . -name "*.txt" -print | xargs sed -i 's/koa-api-boilerplate/PROJECT_NAME/g'
    ```

2. Change git project remote origin
git remote set-url origin https://github.com/USERNAME/YOURREPOSITORY.git

3. Install dependencies
npm install

---

### [Commands](#commands)

1. [Run](#run)
- development
    ```
    npm run dev
    ```
- production with forever
    ```
    npm run prod
    ```

2. [Run tests](#run-tests)
    ```
    npm run test
    ```

3. [Run generators](#run-generators)
    ```
    npm run generate [generator-name](#list-of-generators)
    ```

4. [Generate api documentation](#generate-api-documentation)
    ```
    npm run doc
    ```

5. [Populate Mongo](#populate-mongo)
    ```
    npm run populate
    ```

---

## [What is inside](#what-is-inside):
- Api documentation with [apidoc](http://apidocjs.com/)
- Api versionning
- MongoDB with [mongoose] (http://mongoosejs.com/)
- User Authentication with [passport](http://passportjs.org/)
- File upload management
- Test with [supertest](https://github.com/visionmedia/supertest)
- Generators based on [plop](https://github.com/amwmedia/plop)

---

## [List of generators](#list-of-generators):
- Version
- Module
- Route
- Mongoose Model : `npm run generate model`

---

## [Backend Philosophy](#philosophy)

### [Technologies](#technologies)
* [Koa](http://koajs.com/)

### [Prerequisites](#prerequisites)
- [Koajs](http://koajs.com/)
- [Mongoose](http://mongoosejs.com/)
- [ES6](http://ccoenraets.github.io/es6-tutorial/)

### [Folder Hierarchy](#folder-hierarchy):
    - src
        - config
            - db
                - index.js (babel wrapper)
                - populate.js
                - users.js
            - env
                - common.js
                - production.js
                - development.js
                - test.js
            - index.js
            - passport.js
        - middleware
            - documentation.js
            - index.js
            - uploads.js
            - validators.js
        - modules
            - v1
                - users
                    - index.js
                    - routes.js
                    - validation.js
                - index.js
            - v2
                - users
                    - index.js
                    - routes.js
                    - validation.js
                - object
                    - index.js
                    - routes.js
                    - validation.js
                - index.js
        - models
            - users.js
            - objects.js
        - utils
            -auth.js
        -index.js (babel wrapper)
        -api.js
    - test
        - v1
            -users.spec.js
        - v2
            -users.spec.js
            -object.spec.js
    - package.json
    - .eslintrc
    - .babelrc
    - .gitignore
    - .gitattributes
    - .editorconfig
    - LICENSE
    - README.md

---

## [TODO](#todo):
- Generate CRUD from a model
- Implement Facebook & Google authentication

---

## [Team](#team):
* [Nathan Loisel](https://github.com/nathanloisel)