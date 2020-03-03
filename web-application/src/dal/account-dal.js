const conn = require("./db")
const util = require('util')
const db = util.promisify(conn.query).bind(conn)

module.exports = function ({errors}) {

    return {

        userRegistration: async function (username, password, email) {

            const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
            const values = [username, email, password]

            try {
                return await db(query, values)

            } catch (error) {
                console.log(error)
                if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')){
                    throw new Error(errors.errors.DUP_EMAIL_ER)
                }
                if(error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('PRIMARY')) {
                    throw new Error(errors.errors.DUP_USER_ER)
                } else {
                    throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
                }
            }
        },

        getUser: async function (username) {

            const query = "SELECT * FROM users WHERE username = ?"
            const values = [username]

            try {
                return await db(query, values)
            } catch (error) {
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },

        updateEmail: async function (username, email) {

            const query = "UPDATE users SET email = ? WHERE username = ?"
            const values = [email, username]

            try {
                return await db(query, values)
            } catch (error) {
                console.log(error)
                if(error.code === 'ER_DUP_ENTRY'){
                    throw new Error(errors.errors.DUP_EMAIL_ER)
                } else {
                    throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
                }
            }
        },

        updatePassword: async function (username, password) {
            const query = "UPDATE users SET password = ? WHERE username = ?"
            const values = [password, username]
            try {
                return await db(query, values)
            } catch (error) {
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },

        deleteAccount: async function (username) {
            const query = "DELETE FROM users WHERE username = ?"
            const values = [username]
            try {
                return await db(query, values)
            } catch (error) {
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        }
    }
}
