import config from '../'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.database)

import User from 'models/users'
import Users from './users'

const populateUsers = async () => {
    console.log('Adding users ...')
    Users.forEach(async elem => {
        const user = new User(elem)
        await user.save()
    });
    console.log('Users successfully added !')
}

const populateDatabase = async () => {
    console.log('Populating mongo database ...')
    await populateUsers();
    console.log('Database successfully populated !')
}

const dropDB = async() => {
    console.log('Dropping mongo database ...')
    const models = [User]
    await models.forEach(async (model) => {
        try {
            await model.collection.drop()
            console.log(`${model.collection.name} dropped`)
        } catch (e) {
            console.error(e)
        }
    })
    console.log('Database successfully dropped !')
}

const run = async () => {
    console.log('Start populate script ...')
    await dropDB(noIF)
    await populateDatabase().exit(1)
    console.log('Populate script successfully executed !')
}

try {
    run().then(() => process.exit(0))
} catch (e) {
    console.error(e)
    process.exit(1)
}
