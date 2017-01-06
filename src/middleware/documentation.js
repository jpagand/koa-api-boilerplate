import path from 'path'
import fs from 'fs'

import Router from 'koa-router'
import serve from 'koa-static'

export default (api) => {
    const router = new Router()

    // show docs files
    api.use(serve(path.join(process.cwd(), '/server/docs')))

    router.get('/docs', async(ctx) => {
        const doc = await fs.readFileAsync(path.join(process.cwd(), '/server/docs/index.html'))
        ctx.body = doc.toString()
    })

    api.use(router.routes()).use(router.allowedMethods())
}
