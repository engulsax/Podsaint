const conn = require("./db")
const util = require('util')

const db = util.promisify(conn.query).bind(conn)

exports.userRegistration = async function userRegistration(username, password, email){

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    const values = [username, email, password]
    
    try{
        return await db(query, values)

    }catch(error){
        throw error
    }
}

exports.getUser = async function getUser(username){
    const query = "SELECT * FROM users WHERE username = ?"
    const values = [username]

    try{
        return await db(query, values)

    }catch(error){
        console.log(error)
        throw error
        
    }
}

/*
exports.deleteUser = async function deleteUser() {
    const query = ""
    const values = []

}*/
/*
exports.updateUser = async function updateUser(){
    const query = ""
    const values = [] 
}*/

