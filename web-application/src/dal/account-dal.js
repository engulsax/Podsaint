
module.exports = function({}){

    const conn = require("./db")
    const util = require('util')
    const db = util.promisify(conn.query).bind(conn)

    return{

        userRegistration: async function(username, password, email){

            const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
            const values = [username, email, password]
            
            try{
                return await db(query, values)
        
            }catch(error){
                throw error
            }
        },

        getUser: async function(username){
            const query = "SELECT * FROM users WHERE username = ?"
            const values = [username]
        
            try{
                return await db(query, values)
        
            }catch(error){
                console.log(error)
                throw error
            }
        }
    }
}
