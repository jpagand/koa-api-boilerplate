import Koa from 'koa'
import bodyParser from 'koa-body'
import convert from 'koa-convert'
import compress from 'koa-compress'
import logger from 'koa-logger'
import validate from 'koa-validation'
import KoaQuery from 'koa-qs'
import passport from 'koa-passport'

import mongoose from 'mongoose'

import config from './config'
import 'config/passport'

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

    api.use(convert(logger()))
    api.use(convert(validate()))
    KoaQuery(api)
    api.use(errorMiddleware())
    api.use(passport.initialize())

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
