import passport from 'koa-passport'

/**
 * @apiDefine TokenError
 * @apiError Unauthorized Invalid JWT token
 *
 * @apiErrorExample {json} Unauthorized-Error:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

 /**
  * @apiDefine TokenError
  * @apiError Unauthorized Invalid JWT token
  *
  * @apiErrorExample {json} Unauthorized-Error:
  *     HTTP/1.1 401 Unauthorized
  *     {
  *       "status": 401,
  *       "error": "Unauthorized"
  *     }
  */

 /**
  * @api {post} /v1/auth Authenticate user
  * @apiVersion 1.0.0
  * @apiName AuthUser
  * @apiGroup Auth
  *
  * @apiParam {String} email  User email.
  * @apiParam {String} password  User password.
  *
  * @apiExample Example usage:
  * curl -H "Content-Type: application/json" -X POST -d '{ "email": "johndoe@gmail.com", "password": "foo", 'firstName': "John", "lastName": "Doe" }' localhost:5000/v1/auth
  *
  * @apiSuccess {Object}   user           User object
  * @apiSuccess {ObjectId} user._id       User id
  * @apiSuccess {String}   user.firstName      User first name
  * @apiSuccess {String}   user.lastName      User last name
  * @apiSuccess {String}   user.email  User email
  * @apiSuccess {String}   token          Encoded JWT
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "user": {
  *          "_id": "56bd1da600a526986cf65c80"
  *          "email": "johndoe@gmail.com"
  *          "firstName": "John"
  *          "lastName": "Doe"
  *        },
  *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
  *     }
  *
  * @apiError Unauthorized Incorrect credentials
  *
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 401 Unauthorized
  *     {
  *       "status": 401,
  *       "error": "Unauthorized"
  *     }
  */
const authUser = async function (ctx, next) {
    return passport.authenticate('local', (user, err) => {
        if (!user) {
            ctx.status = 401
            ctx.body = {
                success: false,
                err: {
                    0: {email: {type: 'notFoundRule', message: 'This email does not exists'}},
                },
            }
        } else {
            const token = user.generateToken()
            const response = user.toJSON()
            delete response.password
            ctx.body = {
                token,
                user: response,
            }
        }
    })(ctx, next)
}

export {
    authUser,
}
