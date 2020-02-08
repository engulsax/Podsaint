const accountDAL = require('../dal/account-dal.js')
var bcrypt = require('bcryptjs')

hashPassword = async function hashPassword(password){
    
    const saltRounds = 10
    try{
        return await bcrypt.hash(password, saltRounds)
      
    }catch (error){
        console.log("errorr when hashing")
        console.log(error)
    }
}

unHashPassword = async function unHashPassword(password, hashed){

    try{
        return await bcrypt.compare(password, hashed)

    }catch (error){
        console.log("error when unhash")
        console.log(error)
    }
}

exports.userRegistration = async function userRegistration(username, password){
        
    try{
        //todo - input validation

        //validation ok
        const hashed = await hashPassword(password)
        return await accountDAL.userRegistration(username, hashed)
        
    }catch(error){
        console.log("error with registration")
        console.log(error)
    }
}


exports.userLogin = async function userLogin(username, password){
    
    try{
        const user = await accountDAL.getUser(username)
        const correctPassword = await unHashPassword(password, user[0].password)
        return (user[0].username == username && correctPassword)
        
    }catch(error){
        console.log("error with login")
        console.log(error)
    }
}