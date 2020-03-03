
var bcrypt = require('bcryptjs')

const USERNAME_MIN_LENGTH = 5
const USERNAME_MAX_LENGTH = 40
const PASSWORD_MIN_LENGTH = 5
const PASSWORD_MAX_LENGTH = 40
const EMAIL_MIN_LENGTH = 7
const EMAIL_MAX_LENGTH = 40


module.exports = function ({ accountDAL, errors, authBL }) {

    return {

        userRegistration: async function (username, password, email, errors) {
            
            try {
                
                signInSignUpInputValidation(username, email, password)
                const hashed = await hashPassword(password)
                const user = await accountDAL.userRegistration(username, hashed, email)
                console.log("USER: "+JSON.stringify(user))
                return user

            } catch (error) {
                console.log(error)
                let validationErrors = {}

                if (error == errors.errors.DUP_EMAIL_ERROR) {
                    validationErrors.userDupError = "username_duplication_error"
                }
                if (error == errors.errors.DUP_USER_ERROR) {
                    validationErrors.emailDupError = "email_duplication_error"
                }
                if (error == "email_length_error") {
                    validationErrors.emailLengthError = "email_length_error"
                }
                if (error == "password_length_error") {
                    validationErrors.passwordLengthError = "password_length_error"
                }
                if (error == "username_length_error") {
                    validationErrors.usernameLengthError = "username_length_error"
                }
                throw validationErrors
            }
        },

        userLogin: async function (username, password) {

            try {

                signInSignUpInputValidation(username, null, password)
                const user = await accountDAL.getUser(username)
                const correctPassword = await unHashPassword(password, user[0].password)
                return (user[0].username == username && correctPassword)

            } catch (error) {
                console.log("ERROR: "+JSON.stringify(error) + error)
                let validationErrors = {}
                if (error == "username_length_error") {
                    validationErrors.usernameLengthError = error
                }
                if (error == "password_length_error") {
                    validationErrors.passwordLengthError = error
                }
                throw validationErrors
            }
        },

        updateEmail: async function(user, email, confirmedEmail){
            
            try{
                console.log("-------email---")
                console.log(email)
                console.log(confirmedEmail)
                updateEmailInputValidation(email,confirmedEmail)
                return await accountDAL.updateEmail(user,email)

            }catch (error){
                console.log("ERROR BLOCK IN update email")
                console.log(error)
                let validationErrors = {}

                if(error.code = "email_undefined_error"){
                    validationErrors.emailUndefinedError = "Enter new email address"
                }

                if (error.code == "ER_DUP_ENTRY" && error.sqlMessage.includes('email')) {
                    validationErrors.emailDupError = "email_duplication_error"
                }
                if (error == "email_length_error") {
                    validationErrors.emailLengthError = "email_length_error"
                }
                if (error == "confirmed_email_length_error") {
                    validationErrors.confirmedEmailLengthError = "confirmed_email_length_error"
                }
                if(error == "email_match_error"){
                    validationErrors.emailMatchError = "email_match_error"
                }
                throw validationErrors
            }
        },

        updatePassword: async function(user, password, confirmedPassword){
            
            try{
                updatePasswordInputValidation(password,confirmedPassword)
                const hashed = await hashPassword(password)
                return await accountDAL.updatePassword(user, hashed)

            }catch(error){

                let validationErrors = {}

                if(error = "password_undefined_error"){
                    validationErrors.passwordUndefinedError = "Enter a new password"
                }
                if (error == "password_length_error") {
                    validationErrors.passwordLengthError = "password_length_error"
                }
                if (error == "confirmed_password_length_error") {
                    validationErrors.confirmedPasswordLengthError = "confirmed_password_length_error"
                }
                if (error == "password_match_error"){
                    validationErrors.passwordMatchError = "password_match_error"
                }
                throw validationErrors
            }
        },

        deleteAccount: async function(user){
            try{
                return await accountDAL.deleteAccount(user)
            }catch(error){
                console.log(error)
                throw new Error(errors.errors.PODCAST_FETCH_ERROR)
            }
        }
    }
}


function updatePasswordInputValidation(password, confirmedPassword){
    
    if (!password || !confirmedPassword){
        throw "password_undefined_error"
    }
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
        throw "password_length_error"
    }
    if (confirmedPassword.length < PASSWORD_MIN_LENGTH || confirmedPassword.length > PASSWORD_MAX_LENGTH) {
        throw "confirmed_password_length_error"
    }
    if(password != confirmedPassword){
        throw "password_match_error"
    }
}

function updateEmailInputValidation(email, confirmedEmail){
    if(!email || !confirmedEmail){
        throw "email_undefined_error"
    }
    if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH) {
        throw "email_length_error"
    }
    if (confirmedEmail.length < EMAIL_MIN_LENGTH || confirmedEmail.length > EMAIL_MAX_LENGTH) {
        throw "confirmed_email_length_error"
    }
    if(email != confirmedEmail){
        throw "email_match_error"
    }
        
}

function signInSignUpInputValidation(username, email, password) {

    if (email != null) {
        if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH) {
            throw "email_length_error"
        }
    }

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
        throw "password_length_error"
    }

    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
        throw "username_length_error"
    }
}

async function hashPassword(password) {

    const saltRounds = 10
    try {
        return await bcrypt.hash(password, saltRounds)

    } catch (error) {
        console.log("error when hashing")
        console.log(error)
    }
}

async function unHashPassword(password, hashed) {

    try {
        return await bcrypt.compare(password, hashed)

    } catch (error) {
        console.log("error when unhash")
        console.log(JSON.stringify(error))
    }
}
