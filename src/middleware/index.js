import documentation from './documentation'
import {uploads} from './uploads'

const errorMiddleware = () => {
    return async(ctx, next) => {
        try {
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = {
                sucess: false,
                err,
            }
            ctx.app.emit('error', err, ctx)
        }
    }
}

export {
    documentation,
    errorMiddleware,
    uploads,
}
