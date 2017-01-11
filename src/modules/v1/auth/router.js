import * as auth from './controller'
import * as validators from './validators'

export const baseUrl = '/auth'

const routes = [
    {
        method: 'POST',
        route: '/',
        handlers: [
            validators.authUser,
            auth.authUser,
        ],
    },
]

export default routes
