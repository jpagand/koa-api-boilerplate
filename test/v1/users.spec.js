import 'babel-polyfill'
import api from 'api'
import supertest from 'supertest'
import {expect, should} from 'chai'
import {cleanDb} from '../utils'

should()
const request = supertest.agent(api.listen())

const context = {}

describe('Users', () => {
    before((done) => {
        cleanDb()
        done()
    })

    describe(`POST v1/users`, () => {
        it('should reject signup when data is incomplete', (done) => {
            request.post('/v1/users').set('Accept', 'application/json').send({email: 'supercoolname@koa-api-boilerplate.ch'}).expect(422, done)
        })

        it('should sign up', (done) => {
            request.post(`/v1/users`).set('Accept', 'application/json').send({email: 'admin@koa-api-boilerplate.ch', password: 'admintest', firstName: 'Admin', lastName: 'Koa'}).expect(200, (err, res) => {
                if (err) {
                    return done(err)
                }

                res.body.user.should.have.property('email')
                res.body.user.email.should.equal('admin@koa-api-boilerplate.ch')
                expect(res.body.user.password).to.not.exist

                context.user = res.body.user
                context.token = res.body.token
                done()
            })
        })
    })
})
