import fs from 'fs'
import path from 'path'

import Koa from 'koa'
import Router from 'koa-router'
import mount from 'koa-mount'
import convert from 'koa-convert'

import Upload from 'models/uploads'

const saveUpload = async (file) => {
    if (file) {
        const upload = new Upload({
            name: file.name,
            path: file.path,
            size: file.size,
            mimeType: file.type
        })
        try {
            await upload.save()
            return upload
        } catch (err) {
            console.error(err)
            return null
        }
    } else {
        console.error('No file provided to saveUpload')
        return null
    }
}

const uploads = (api) => {
    const uploads = new Koa()
    const router = new Router()
    try {
        const stats = fs.statSync('uploads')
            // Is it a directory?
        if (!stats.isDirectory()) {
            fs.mkdirSync('uploads')
        }
    } catch (e) {
        fs.mkdirSync('uploads')
    }

    router.get('/:path', async(ctx) => {
        const upload = await Upload.findOne({path: `uploads/${ctx.params.path}`})
        ctx.set('Content-Encoding', 'identity')
        const fileName = path.join(process.cwd(), upload.path)
        ctx.body = fs.createReadStream(fileName)
        const fileStat = fs.statSync(fileName)
        ctx.length = fileStat.size
        ctx.type = upload.mimeType
        ctx.status = 200
    })

    uploads
        .use(router.routes())
        .use(router.allowedMethods())

    api.use(convert(mount('/uploads', uploads)))
}

export default saveUpload

export {
    uploads,
}
