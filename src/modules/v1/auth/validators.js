/*
 *
 * auth validators
 *
 */

import convert from 'koa-convert'

const authUser = convert(function * (next) {
    yield this.validateBody({
        email: 'required|email',
        password: 'required|minLength:6',
    }, null, {
        before: {
            email: 'trim|lowercase',
        },
    })

    if (this.validationErrors) {
        this.throw(this.validationErrors, 422)
    } else {
        yield next
    }
})

export {authUser}
