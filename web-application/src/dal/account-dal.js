const conn = require("./db")
const util = require('util')

const db = util.promisify(conn.query).bind(conn)

exports.userRegistration = async function userRegistration(username, password){

    const query = "INSERT INTO users (username, password) VALUES (?, ?)"
    const values = [username, password]
    
    try{
        return await db(query, values)

    }catch(error){
        console.log(error)
    }
}

exports.getUser = async function getUser(username){
    const query = "SELECT * FROM users WHERE username = ?"
    const values = [username]

    try{
        return await db(query, values)

    }catch(error){
        console.log(error)
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

