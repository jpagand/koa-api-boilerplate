import config from '../'
import mongoose from 'mongoose'

import User from 'models/users'
import Users from './users'

mongoose.Promise = global.Promise
mongoose.connect(config.database)

const populateUsers = async () => {
    console.log('Adding users ...')
    for (let elem of Users) {
        try {
            const user = new User(elem)
            await user.save()
            console.log(` --> User ${user._id} successfully created !`)
        } catch (e) {
            console.log(e)
        }
    }
}

const populateDatabase = async () => {
    console.log('Populating mongo database ...')
    await populateUsers()
    console.log('Database successfully populated !')
}

const dropDB = async() => {
    console.log('Dropping mongo database ...')
    const models = [User]
    for (let model of models) {
        try {
            await model.collection.drop()
            console.log(` --> ${model.collection.name} dropped`)
        } catch (e) {
            console.error(e)
        }
    }
    console.log('Database successfully dropped !')
}

const run = async function run () {
    console.log('Start populate script ...')
    await dropDB()
    await populateDatabase()
    console.log('Populate script successfully executed !')
}

run().then(() => {
    process.exit(0)
}).catch((e) => {
    console.error(e)
    process.exit(1)
})
