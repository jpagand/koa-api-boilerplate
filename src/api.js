import Koa from 'koa'
import bodyParser from 'koa-body'
import convert from 'koa-convert'
import compress from 'koa-compress'
import logger from 'koa-logger'
import validate from 'koa-validation'
import KoaQuery from 'koa-qs'
import passport from 'koa-passport'
/** GENERATED IMPORTS. DO NOT TOUCH **/
import session from 'koa-generic-session'
import MongoStore from 'koa-generic-session-mongo'

import mongoose from 'mongoose'

import config from './config'

import {errorMiddleware, documentation, uploads} from 'middleware'
import modules from 'modules'

const initApi = () => {
    const api = new Koa()

    mongoose.Promise = global.Promise
    mongoose.connect(config.database)

    api.use(bodyParser({
        formidable: {uploadDir: `uploads`},    // This is where the files would come
        multipart: true,
    }))

    if (process.env.NODE_ENV !== 'development') {
        api.use(convert(logger()))
    }
    api.use(convert(validate()))
    KoaQuery(api)
    api.use(errorMiddleware())
    api.use(passport.initialize())

    /** GENERATED CONTENT. DO NOT TOUCH **/
    api.keys = ['your-session-secret', 'another-session-secret']
    api.use(convert(session({
        store: new MongoStore(),
    })))

    documentation(api)
    modules(api)
    uploads(api)

    api.use(compress({
        flush: require('zlib').Z_SYNC_FLUSH,
    }))
    return api
}

const api = initApi()

export default api
