import 'babel-polyfill'
import mongoose from 'mongoose'

export function cleanDb () {
    for (const collection in mongoose.connection.collections) {
        if (mongoose.connection.collections.hasOwnProperty(collection)) {
            mongoose.connection.collections[collection].remove()
        }
    }
}

export function authUser (agent, callback) {
    agent.post(`v1/users`).set('Accept', 'application/json').send({email: 'test@koa-api-boilerplate.ch', password: 'password', firstName: 'test', lastName: 'Koa'}).end((err, res) => {
        if (err) {
            return callback(err)
        }

        callback(null, {
            user: res.body.user,
            token: res.body.token
        })
    })
}
