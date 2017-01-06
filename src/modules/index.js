import glob from 'glob'
import Router from 'koa-router'

const initModules = (api, versionPath) => {
    const versionName = versionPath.split('/').pop();

    glob(`${versionPath}/*`, {
        ignore: '**/index.js'
    }, (err, matches) => {
        if (err) {
            throw err
        }

        matches.forEach((mod) => {
            const router = require(`${mod}/router`)

            const routes = router.default
            const baseUrl = router.baseUrl
            const instance = new Router({prefix: `/${versionName}${baseUrl}`})

            routes.forEach((config) => {
                const {
                    method = '',
                    route = '',
                    handlers = []
                } = config

                const lastHandler = handlers.pop()

                instance[method.toLowerCase()](route, ...handlers, async function(ctx) {
                    return await lastHandler(ctx)
                })
            })
            instance.use(ctx => {
                var err = new Error('Not Found')
                ctx.throw(err, 404)
            })

            api.use(instance.routes()).use(instance.allowedMethods())
        })
        api.use(ctx => {
            var err = new Error('Not Found')
            ctx.throw(err, 404)
        })
    })
}

export default function initVersions (api) {
    glob(`${__dirname}/*`, {
        ignore: '**/index.js'
    }, (err, matches) => {
        if (err) {
            throw err
        }
        matches.forEach((versionPath) => initModules(api, versionPath))
    })
}
