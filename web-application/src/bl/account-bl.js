
var bcrypt = require('bcryptjs')
const err = require('../errors/error')


const USERNAME_MIN_LENGTH = 0
const USERNAME_MAX_LENGTH = 40
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 40
const EMAIL_MIN_LENGTH = 0
const EMAIL_MAX_LENGTH = 40


module.exports = function ({ accountDAL }) {

    return {

        userRegistration: async function (username, password, email) {

            try {

                signUpInputValidation(username, email, password)
                const hashed = await hashPassword(password)
                const user = await accountDAL.userRegistration(username, hashed, email)
                return user

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        userLogin: async function (username, password) {

            try {

                const user = await accountDAL.getUser(username)
                if (user[0] && await passwordCorrect(password, user[0].password)) {
                    return true
                } else {
                    console.log("error - userLogin - account-bl.js")
                    throw err.err.LOGIN_ERROR
                }

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        updateEmail: async function (user, email, confirmedEmail) {

            try {

                updateEmailInputValidation(email, confirmedEmail)
                return await accountDAL.updateEmail(user, email)

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        updatePassword: async function (user, password, confirmedPassword) {

            try {
                updatePasswordInputValidation(password, confirmedPassword)
                const hashed = await hashPassword(password)
                return await accountDAL.updatePassword(user, hashed)

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        deleteAccount: async function (user) {
            try {
                return await accountDAL.deleteAccount(user)
            } catch (error) {
                console.log(error)
                throw err.err.PODCAST_FETCH_ERROR
            }
        }
    }

    function updatePasswordInputValidation(password, confirmedPassword) {

        const passwordErrors = []
        if (!password || !confirmedPassword) {
            passwordErrors.push(err.err.PASSWORD_UNDEFINED_ERROR)
        }
        if (password.length < PASSWORD_MIN_LENGTH) {
            passwordErrors.push(err.err.PASSWORD_LENGTH_SHORT_ERROR)
        }
        if (password.length > PASSWORD_MAX_LENGTH) {
            passwordErrors.push(err.err.PASSWORD_LENGTH_LONG_ERROR)
        }
        if (password != confirmedPassword) {
            passwordErrors.push(err.err.PASSWORD_MATCH_ERROR)
        }
        if (passwordErrors.length != 0) {
            throw passwordErrors
        }
    }

    function updateEmailInputValidation(email, confirmedEmail) {

        const emailErrors = []

        if (!email || !confirmedEmail) {
            emailErrors.push(err.err.EMAIL_UNDEFINED_ERROR)
        }

        if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH) {
            emailErrors.push(err.err.EMAIL_LENGTH_ERROR)
        }

        if (email != confirmedEmail) {
            emailErrors.push(err.err.EMAIL_MATCH_ERROR)
        }

        if (emailErrors.length != 0) {
            throw emailErrors
        }

    }

    function signUpInputValidation(username, email, password) {

        const signInErrors = []

        if (!password) {
            signInErrors.push(err.err.PASSWORD_UNDEFINED_ERROR)
        }

        if (!username) {
            signInErrors.push(err.err.USERNAME_UNDEFINED_ERROR)
        }

        if (!email) {
            signInErrors.push(err.err.EMAIL_UNDEFINED_ERROR)
        }

        if (email != null) {
            if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH) {
                signInErrors.push(err.err.EMAIL_LENGTH_ERROR)
            }
        }

        if (password.length > PASSWORD_MAX_LENGTH) {
            signInErrors.push(err.err.PASSWORD_LENGTH_LONG_ERROR)
        }

        if (password && password.length < PASSWORD_MIN_LENGTH) {
            signInErrors.push(err.err.PASSWORD_LENGTH_SHORT_ERROR)
        }

        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
            signInErrors.push(err.err.USERNAME_LENGTH_ERROR)
        }

        if (signInErrors.length != 0) {
            throw signInErrors
        }
    }

    async function hashPassword(password) {

        const saltRounds = 10
        try {
            return await bcrypt.hash(password, saltRounds)

        } catch (error) {
            console.log(error)
            throw err.err.INTERNAL_SERVER_ERROR
        }
    }

    async function passwordCorrect(password, hashed) {

        try {
            return await bcrypt.compare(password, hashed)

        } catch (error) {
            console.log(JSON.stringify(error))
            throw err.err.INTERNAL_SERVER_ERROR
        }
    }
}


