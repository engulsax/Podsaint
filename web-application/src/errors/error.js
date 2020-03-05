
const errors = {
    INTERNAL_SERVER_ERROR: "There seems to a problem with our servers, try again later.",
    CATEGORY_FETCH_ERROR: "We couldn't fetch the categories.",
    PODCAST_FETCH_ERROR: "We couldn't fetch the podcasts.",
    NOT_FOUND_ERROR: "The page you are looking for couldn't be found.",
    DUP_EMAIL_ERROR: "This email already exists.",
    DUP_USER_ERROR: "This username already exists.",
    PODCAST_NOT_FOUND: "The podcast you are looking for does not exists.",
    AUTH_USER_ERROR: "You have to be signed in to do this action.",
    PASSWORD_UNDEFINED_ERROR: "Please enter a password.",
    PASSWORD_LENGTH_SHORT_ERROR: "Password is too short",
    PASSWORD_LENGTH_LONG_ERROR: "Password is too long",
    PASSWORD_MATCH_ERROR: "The passwords doesn't match.",
    EMAIL_UNDEFINED_ERROR: "Please enter a email.",
    EMAIL_LENGTH_ERROR: "The email is too long",
    EMAIL_MATCH_ERROR: "The emails doesn't match.",
    USERNAME_LENGTH_ERROR: "Username is too long.",
    USERNAME_UNDEFINED_ERROR: "Please enter a username.",
    LOGIN_ERROR: "Username or password is not correct."
}

function getErrorStatusCode(error) {
    switch (error) {
        case errors['INTERNAL_SERVER_ERROR']:
            return 500
        case errors['LOGIN_ERROR']: 
        case errors['AUTH_USER_ERROR']:
            return 401
        case errors['NOT_FOUND_ERROR']:
        case errors['PODCAST_NOT_FOUND']:
        case errors['CATEGORY_FETCH_ERROR']:
            return 404
        default:
            return -1
    }
}

function errorExist(errs){
    if(Array.isArray(errs)){
        for(err of errs){
            if(Object.keys(errors).includes(err)){
                return true
            }
        }
    } else {
        if(Object.keys(errors).includes(errs)){
            return true
        }
    }
    return false
}

module.exports.errorExist = errorExist
module.exports.err = errors
module.exports.getErrCode = getErrorStatusCode
