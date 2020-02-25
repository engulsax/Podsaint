const conn = require("./db")
const util = require('util')
const db = util.promisify(conn.query).bind(conn)

module.exports = function ({ }) {

    return {

        userRegistration: async function (username, password, email) {

            const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
            const values = [username, email, password]

            try {
                return await db(query, values)

            } catch (error) {
                console.log("----ERRRRROOORRRR---- " + JSON.stringify(error))
                throw error
            }
        },

        getUser: async function (username) {

            const query = "SELECT * FROM users WHERE username = ?"
            const values = [username]

            try {
                return await db(query, values)

            } catch (error) {
                console.log("----ERRRRROOORRRR NUMBAH TWO---- " + JSON.stringify(error))
                throw error
            }
        },

        updateEmail: async function(username, email){

            const query = "UPDATE users SET email = ? WHERE username = ?"
            const values = [email, username]
            
            try{
                return await db(query, values)

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH THREE---- " + JSON.stringify(error))
                throw error
            }
        },

        updatePassword: async function(username, password){
            const query = "UPDATE users SET password = ? WHERE username = ?"
            const values = [password, username]
            try{
                return await db(query, values)

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH FOUR---- " + JSON.stringify(error))
                throw error
            }
        },

        deleteAccount: async function(username){
            const query = "DELETE FROM users WHERE username = ?"
            const values = [username]
            try{
                return await db(query, values)

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH FIVE---- " + JSON.stringify(error))
                throw error
            }
        }
    }
}
