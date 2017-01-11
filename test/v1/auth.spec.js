import 'babel-polyfill'
import api from '../api'
import supertest from 'supertest'
import {expect, should} from 'chai'
import {cleanDb, authUser} from '../utils'

should()
const request = supertest.agent(api.listen())
const context = {}
describe('Auth', () => {
    before((done) => {
        cleanDb()
        authUser(request, (err, {user, token}) => {
            if (err) {
                return done(err)
            }

            context.user = user
            context.token = token
            done()
        })
    })

    describe(`POST /auth`, () => {
        it('should throw 401 if credentials are incorrect', (done) => {
            request.post(`/auth`).set('Accept', 'application/json').send({email: 'supercoolname@koa-api-boilerplate.ch', password: 'wrongpassword'}).expect(401, done)
        })

        it('should auth user', (done) => {
            request.post(`/auth`).set('Accept', 'application/json').send({email: 'test@koa-api-boilerplate.ch', password: 'password'}).expect(200, (err, res) => {
                if (err) {
                    return done(err)
                }

                res.body.user.should.have.property('email')
                res.body.user.email.should.equal('test@koa-api-boilerplate.ch')
                expect(res.body.user.password).to.not.exist

                context.user = res.body.user
                context.token = res.body.token

                done()
            })
        })
    })
})
