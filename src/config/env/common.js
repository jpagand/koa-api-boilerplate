export default {
  session: 'koa-api-boilerplate-secret-token',
  token: 'secret-jwt-token',
  database: 'mongodb://localhost:27017/koa-api-boilerplate',
  email: {
    service: 'GMail',
    auth: {
      user: 'user.email@gmail.com',
      pass: 'password',
    },
  },
  resetPasswordExpiresDuration: 72, // 72 hours = 3 days
  facebook: {
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: 'callbackURL',
  },
}
