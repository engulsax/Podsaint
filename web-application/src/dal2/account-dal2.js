const pgdb = require('./pgdb')
const err = require('../errors/error')

module.exports = function ({ }) {

    return {

        userRegistration: async function (username, password, email) {
            try {
                return await pgdb.users.create({
                    username: username,
                    email: email,
                    password: password
                })

            } catch (error) {

                if (error.errors[0].path == "username" && error.errors[0].type == "unique violation") {
                    throw err.err.DUP_USER_ERROR
                }
                if (error.errors[0].path == "email" && error.errors[0].type == "unique violation") {
                    throw err.err.DUP_EMAIL_ERROR
                } else {
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },

        getUser: async function (username) {
            try {
                return await pgdb.users.findAll({
                    where: { username: username }
                })

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        updateEmail: async function (username, email) {
            try {
                return await pgdb.users.update(
                    { email: email },
                    {
                        where: { username: username }
                    })

            } catch (error) {

                if (error.errors[0].path == "email" && error.errors[0].type == "unique violation") {
                    throw err.err.DUP_EMAIL_ERROR
                }
                else {
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },

        updatePassword: async function (username, password) {
            try {
                return await pgdb.users.update(
                    { password: password },
                    { where: { username: username }
                    })

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        deleteAccount: async function (username) {
            try {
                return await pgdb.users.destroy(
                    { where: { username: username }
                    })

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        }
    }
}


