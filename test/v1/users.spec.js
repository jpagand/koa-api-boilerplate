import 'babel-polyfill'
import api from 'api'
import supertest from 'supertest'
import { expect, should } from 'chai'
import { cleanDb } from '../utils'
import User from 'models/users'

should()
const request = supertest.agent(api.listen())

const context = {}

describe('Users', () => {
  before(done => {
    cleanDb()
    done()
  })

  describe(`POST v1/users`, () => {
    it('should reject signup when data is incomplete', done => {
      request.post('/v1/users').set('Accept', 'application/json').send({ email: 'supercoolname@koa-api-boilerplate.ch' }).expect(422, done)
    })

    it('should sign up', done => {
      request
        .post(`/v1/users`)
        .set('Accept', 'application/json')
        .send({ email: 'admin@koa-api-boilerplate.ch', password: 'admintest', firstName: 'Admin', lastName: 'Koa' })
        .expect(200, (err, res) => {
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

  describe(`POST  /v1/users/change-password`, () => {
    it('should not ChangePassword if the authorization header is missing', done => {
      try {
        request.post('/v1/users/change-password').set('Accept', 'application/json').expect(401, done)
      } catch (ex) {
        console.log(ex)
      }
    })

    it('should not ChangePassword if the authorization header is missing the scheme', done => {
      request.post('/v1/users/change-password').set({ Accept: 'application/json', Authorization: '1' }).expect(401, done)
    })

    it('should not ChangePassword if the authorization header has invalid scheme', done => {
      const { token } = context
      request.post('/v1/users/change-password').set({ Accept: 'application/json', Authorization: `Unknown ${token}` }).expect(401, done)
    })

    it('should not ChangePassword if token is invalid', done => {
      request.post('/v1/users/change-password').set({ Accept: 'application/json', Authorization: 'Bearer 1' }).expect(401, done)
    })
    it('should ChangePassword', done => {
      const { token } = context
      request
        .post('/v1/users/change-password')
        .set({ Accept: 'application/json', Authorization: `Bearer ${token}` })
        .send({
          oldPassword: 'admintest',
          password: 'admintest',
        })
        .expect(200, (err, res) => {
          if (err) {
            return done(err)
          }
          res.body.should.have.property('token')
          context.token = res.body.token
          done()
        })
    })
  })

  describe(`POST  /v1/users/reset-password-query`, () => {
    it('should ResetPasswordQuery', done => {
      const { token } = context
      request
        .post('/v1/users/reset-password-query')
        .set({ Accept: 'application/json', Authorization: `Bearer ${token}` })
        .send({
          email: 'admin@koa-api-boilerplate.ch',
        })
        .expect(200, (err, res) => {
          if (err) {
            return done(err)
          }
          res.body.should.have.property('success')
          done()
        })
    })
  })

  describe(`POST  /v1/users/reset-password`, () => {
    it('should ResetPassword', done => {
      User.findById(context.user._id).then(response => {
        request
          .post('/v1/users/reset-password')
          .set({ Accept: 'application/json' })
          .send({
            token: response.resetPasswordToken,
            password: 'admin@koa-api-boilerplate.ch',
          })
          .expect(200, (err, res) => {
            if (err) {
              return done(err)
            }
            res.body.should.have.property('token')
            res.body.should.have.property('user')
            done()
          })
      })
    })
  })

  /* GENERATED: TEST DO NOT TOUCH */
})
