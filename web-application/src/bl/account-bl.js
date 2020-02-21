
var bcrypt = require('bcryptjs')

const USERNAME_MIN_LENGTH = 5
const USERNAME_MAX_LENGTH = 40
const PASSWORD_MIN_LENGTH = 5
const PASSWORD_MAX_LENGTH = 40
const EMAIL_MIN_LENGTH = 7
const EMAIL_MAX_LENGTH = 40


module.exports = function ({ accountDAL }) {

    return {

        userRegistration: async function (username, password, email) {


            console.log("kommit hit till userreg")
            try {
                inputValidation(username, email, password)
                const hashed = await hashPassword(password)
                console.log("kommit hit till userreg2")

                const user = await accountDAL.userRegistration(username, hashed, email)
                console.log("USER: "+JSON.stringify(user))
                return user
            } catch (error) {

                let validationErrors = {}

                if (error.code == "ER_DUP_ENTRY" && error.sqlMessage.includes('username')) {
                    validationErrors.userDupError = "username_duplication_error"
                }
                if (error.code == "ER_DUP_ENTRY" && error.sqlMessage.includes('email')) {
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
                inputValidation(username, null, password)

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
        }
    }
}


function inputValidation(username, email, password) {

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
        console.log("errorr when hashing")
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
