import User from 'models/users'

/**
 * @api {post} /v1/users Create a new user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "username": "johndoe", "password": "secretpasas" } }' localhost:5000/v1/users
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.username Username.
 * @apiParam {String} user.password Password.
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 */
const createUser = async(ctx) => {
    const user = new User(ctx.request.body)
    try {
        await user.save()
    } catch (err) {
        if (err.code === 11000) {
            ctx.throw(422, {
                '0': {
                    'email': {
                        type: 'uniqueEmail',
                        rule: 'unique',
                        message: 'Email can\'t be the same for 2 users.',
                    },
                },
            })
        } else {
            ctx.throw(422, err)
        }
    }

    const token = user.generateToken()
    const response = user.toJSON()

    delete response.password

    ctx.body = {
        user: response,
        token,
    }
}

/**
 * @api {get} /v1/users/:id Get user by id
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/v1/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
const getUser = async(ctx, next) => {
    ctx.body = {
        user: ctx.state.user,
    }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission
 * @apiVersion 1
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name" } }' localhost:5000/v1/users/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.name     Name.
 * @apiParam {String} user.username Username.
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      Updated name
 * @apiSuccess {String}   users.username  Updated username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */
const updateUser = async(ctx) => {
    const user = ctx.state.user

    Object.assign(user, ctx.request.body.user)

    await user.save()

    ctx.body = {
        user,
    }
}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission
 * @apiVersion 1
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/v1/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

const deleteUser = async(ctx) => {
    const user = ctx.state.user

    await user.remove()

    ctx.status = 200
    ctx.body = {
        success: true,
    }
}

/* GENERATED: HANDLER DO NOT TOUCH */

export {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    /* GENERATED: EXPORT HANDLER DO NOT TOUCH */
}
