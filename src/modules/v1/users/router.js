import {
    ensureUser
} from 'middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

const routes = [
    {
        method: 'POST',
        route: '/',
        handlers: [
            user.createUser
        ]
    },
    {
        method: 'GET',
        route: '/',
        handlers: [
            ensureUser,
            user.getUser
        ]
    },
    {
        method: 'PUT',
        route: '/',
        handlers: [
            ensureUser,
            user.getUser,
            user.updateUser
        ]
    },
    {
        method: 'DELETE',
        route: '/',
        handlers: [
            ensureUser,
            user.getUser,
            user.deleteUser
        ]
    }
]

export
default routes
