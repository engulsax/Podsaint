const accountDAL = require('../dal/account-dal.js')
var bcrypt = require('bcryptjs')


const USERNAME_MIN_LENGTH = 5
const USERNAME_MAX_LENGTH = 40
const PASSWORD_MIN_LENGTH = 5
const PASSWORD_MAX_LENGTH = 40
const EMAIL_MIN_LENGTH = 7 
const EMAIL_MAX_LENGTH = 40

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
function inputValidation(username,email,password){
   
    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH ){   
        throw "username_length_error"
    }
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH ){      
        throw "password_length_error"
    }
    if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH){
        throw "email_length_error"
    }
}

exports.userRegistration = async function userRegistration(username, password, email){

        try{
            inputValidation(username,email,password)
            const hashed = await hashPassword(password)
            return await accountDAL.userRegistration(username, hashed, email)
            
        }catch(error){

            let validationErrors = {}

            if (error.code == "ER_DUP_ENTRY" && error.sqlMessage.includes('username')){
                validationErrors.userDupError = "username_duplication_error"          
            }
            if (error.code == "ER_DUP_ENTRY" && error.sqlMessage.includes('email')){
                validationErrors.emailDupError = "email_duplication_error"
            }
            if (error == "email_length_error"){
                validationErrors.emailLengthError = "email_length_error"
            }
            if (error == "password_length_error"){
                validationErrors.passwordLengthError = "password_length_error"
            }
            if (error == "username_length_error"){
                validationErrors.usernameLengthError = "username_length_error"
            }
            throw validationErrors
        }     
}

function loginInputValidation(username, password){
    
    if(username.length == 0 || username.length > USERNAME_MAX_LENGTH){
        throw "username_length_error"
    }
    if(password.length == 0 || password.length > PASSWORD_MAX_LENGTH){
        throw "password_length_error"
    }
}

exports.userLogin = async function userLogin(username, password){
    
    try{
        loginInputValidation(username, password)
    
        const user = await accountDAL.getUser(username)
        const correctPassword = await unHashPassword(password, user[0].password)
        return (user[0].username == username && correctPassword)
        
    }catch(error){
        let validationErrors = {}
        if(error == "username_length_error"){
            validationErrors.usernameLengthError = error
        }
        if(error = "password_length_error"){
            validationErrors.passwordLengthError = error
        }
        throw validationErrors
    }
}